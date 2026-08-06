"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CursorGlow() {
  const reduceMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const glowX = useSpring(mouseX, { stiffness: 120, damping: 30, mass: 0.4 });
  const glowY = useSpring(mouseY, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const handleChange = () => setFinePointer(media.matches);
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!finePointer || reduceMotion) return;
    const handleMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [finePointer, reduceMotion, mouseX, mouseY]);

  if (!finePointer || reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[5] -ml-[200px] -mt-[200px] size-[400px] rounded-full"
      style={{
        x: glowX,
        y: glowY,
        background:
          "radial-gradient(circle, color-mix(in oklab, var(--primary) 6%, transparent) 0%, transparent 70%)",
      }}
    />
  );
}
