"use client";

import Lenis from "lenis";
import type { ScrollToOptions } from "lenis";
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ScrollTarget = string | number | HTMLElement;

type LenisContextValue = {
  ready: boolean;
  scrollTo: (target: ScrollTarget, opts?: ScrollToOptions) => void;
  stop: () => void;
  start: () => void;
};

const LenisContext = createContext<LenisContextValue | null>(null);

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    setReady(true);

    let rafId = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      setReady(false);
    };
  }, []);

  const scrollTo = useCallback(
    (target: ScrollTarget, opts?: ScrollToOptions) => {
      const lenis = lenisRef.current;
      if (!lenis) return;
      // Resume if stopped so a programmatic scroll is not dropped (Lenis
      // ignores scrollTo while stopped, e.g. when the mobile menu locks it).
      if (lenis.isStopped) lenis.start();
      lenis.scrollTo(target, { offset: -80, ...opts });
    },
    []
  );

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  return createElement(
    LenisContext.Provider,
    { value: { ready, scrollTo, stop, start } },
    children
  );
}

export function useLenis(): LenisContextValue {
  const context = useContext(LenisContext);
  if (context === null) {
    throw new Error("useLenis must be used within a LenisProvider");
  }
  return context;
}
