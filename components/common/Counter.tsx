"use client";

import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useInViewOnce } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type CounterProps = {
  to: number;
  suffix?: string;
  decimals?: number;
  className?: string;
};

export function Counter({ to, suffix = "", decimals = 0, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInViewOnce(ref, { margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (current) => setValue(current),
    });

    return () => controls.stop();
  }, [inView, to]);

  const formatted = value.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {formatted}
      {suffix}
    </span>
  );
}
