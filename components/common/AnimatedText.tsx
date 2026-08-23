"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

type AnimatedTextProps = {
  text: string;
  className?: string;
  delay?: number;
  as?: ElementType;
  highlight?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function AnimatedText({
  text,
  className,
  delay = 0,
  as: Tag = "span",
  highlight,
}: AnimatedTextProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  const highlightWords = highlight ? highlight.split(" ") : [];

  const isHighlighted = (index: number): boolean => {
    if (highlightWords.length === 0) return false;
    for (let start = 0; start <= words.length - highlightWords.length; start += 1) {
      let match = true;
      for (let offset = 0; offset < highlightWords.length; offset += 1) {
        if (words[start + offset] !== highlightWords[offset]) {
          match = false;
          break;
        }
      }
      if (match) return index >= start && index < start + highlightWords.length;
    }
    return false;
  };

  return (
    <Tag className={cn("inline-block", className)} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden align-bottom"
          aria-hidden="true"
        >
          <motion.span
            className={cn("inline-block", isHighlighted(index) && "text-gradient")}
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
