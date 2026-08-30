"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right";
  id?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const HIDDEN: Record<NonNullable<RevealProps["direction"]>, { x?: number; y?: number }> = {
  up: { y: 24 },
  left: { x: -24 },
  right: { x: 24 },
};

export function Reveal({ children, delay = 0, className, direction = "up", id }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const from = reduceMotion ? { opacity: 0 } : { opacity: 0, ...HIDDEN[direction] };

  return (
    <motion.div
      id={id}
      className={cn(className)}
      initial={from}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
