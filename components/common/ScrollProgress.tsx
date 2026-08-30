"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const INTRO_DURATION = 0.8;

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scrollSpring = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const displayX = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const introDone = useRef(false);
  const prevPath = useRef(pathname);

  useMotionValueEvent(scrollSpring, "change", (value) => {
    if (!introDone.current) return;
    displayX.set(value);
  });

  const runIntro = useCallback(() => {
    if (reduceMotion) {
      introDone.current = true;
      displayX.set(scrollSpring.get());
      return;
    }
    introDone.current = false;
    void animate(displayX, 1, {
      duration: INTRO_DURATION,
      ease: "easeInOut",
    }).then(() => {
      introDone.current = true;
      displayX.set(scrollSpring.get());
    });
  }, [displayX, reduceMotion, scrollSpring]);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      runIntro();
    } else {
      runIntro();
    }
  }, [pathname, runIntro]);

  return (
    <>
      <div
        data-testid="scroll-track"
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[69] h-1 bg-border"
      />
      <motion.div
        data-testid="scroll-fill"
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-gradient-to-r from-primary to-accent"
        style={{ scaleX: displayX }}
      />
    </>
  );
}