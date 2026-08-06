"use client";

import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMounted } from "@/hooks/use-mounted";

const DURATION = 1.2;
const EASE = [0.22, 1, 0.36, 1] as const;

export function LoadingScreen() {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!mounted) return;
    const controls = animate(0, 100, {
      duration: reduceMotion ? 0.4 : DURATION,
      ease: reduceMotion ? "easeOut" : EASE,
      onUpdate: (value) => setProgress(value),
    });
    return () => controls.stop();
  }, [mounted, reduceMotion]);

  useEffect(() => {
    if (!mounted || progress < 100) return;
    const timer = window.setTimeout(() => setLoading(false), 150);
    return () => window.clearTimeout(timer);
  }, [mounted, progress]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background"
          exit={{ opacity: 0, y: -24, scale: 1.02 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.6, ease: reduceMotion ? "easeOut" : EASE }}
        >
          <span className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Kantong
            <span className="text-primary">In</span>
            <span className="text-primary">.</span>
          </span>
          <div
            role="progressbar"
            aria-label="Memuat halaman"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            className="h-1 w-40 overflow-hidden rounded-full bg-border"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted">{Math.round(progress)}%</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
