"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <div
        data-testid="scroll-track"
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[69] h-1 bg-foreground/10"
      />
      <motion.div
        data-testid="scroll-fill"
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-gradient-to-r from-primary to-accent"
        style={{ scaleX }}
      />
    </>
  );
}
