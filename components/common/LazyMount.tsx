"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { REVEAL_SECTION_EVENT } from "@/lib/reveal-section";

const DEFAULT_ROOT_MARGIN = "600px 0px";

type LazyMountProps = {
  children: ReactNode;
  className?: string;
  hashes?: string[];
  minHeight?: string;
};

export function LazyMount({
  children,
  className,
  hashes,
  minHeight = "40vh",
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (hashes?.some((hash) => window.location.hash === hash)) {
      setShow(true);
      return;
    }

    const onReveal = (event: Event) => {
      const hash = (event as CustomEvent<string>).detail;
      if (!hashes || hashes.includes(hash)) setShow(true);
    };
    const onHashChange = () => {
      if (hashes?.some((hash) => window.location.hash === hash)) setShow(true);
    };

    window.addEventListener(REVEAL_SECTION_EVENT, onReveal);
    window.addEventListener("hashchange", onHashChange);

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: DEFAULT_ROOT_MARGIN }
    );
    observer.observe(el);

    return () => {
      window.removeEventListener(REVEAL_SECTION_EVENT, onReveal);
      window.removeEventListener("hashchange", onHashChange);
      observer.disconnect();
    };
  }, [hashes]);

  return (
    <div ref={ref} className={className} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
}
