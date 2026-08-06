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
  type ReactNode,
} from "react";

type ScrollTarget = string | number | HTMLElement;

type LenisContextValue = {
  scrollTo: (target: ScrollTarget, opts?: ScrollToOptions) => void;
};

const LenisContext = createContext<LenisContextValue | null>(null);

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;

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
    };
  }, []);

  const scrollTo = useCallback(
    (target: ScrollTarget, opts?: ScrollToOptions) => {
      lenisRef.current?.scrollTo(target, { offset: -80, ...opts });
    },
    []
  );

  return createElement(LenisContext.Provider, { value: { scrollTo } }, children);
}

export function useLenis(): LenisContextValue {
  const context = useContext(LenisContext);
  if (context === null) {
    throw new Error("useLenis must be used within a LenisProvider");
  }
  return context;
}
