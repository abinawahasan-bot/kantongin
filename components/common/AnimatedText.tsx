"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

type AnimatedTextProps = {
  text: string;
  className?: string;
  delay?: number;
  as?: ElementType;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function AnimatedText({
  text,
  className,
  delay = 0,
  as: Tag = "span",
}: AnimatedTextProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <Tag className={cn("inline-block", className)} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden align-bottom"
          aria-hidden="true"
        >
          <motion.span
            className="inline-block"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "0.8em" }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: "0em" }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              ease: EASE,
              delay: delay + index * 0.08,
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
