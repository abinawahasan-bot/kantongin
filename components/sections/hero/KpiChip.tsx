"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type KpiChipProps = {
  value: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  floatDelay?: number;
};

export function KpiChip({ value, label, icon, className, floatDelay = 0 }: KpiChipProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
      className={cn(
        "pointer-events-none absolute z-10 flex items-center gap-2.5 rounded-xl border border-border bg-card/90 px-3.5 py-2.5 shadow-sm backdrop-blur",
        className
      )}
    >
      {icon ? <span className="text-primary">{icon}</span> : null}
      <span>
        <span className="block text-sm font-bold leading-tight text-foreground">{value}</span>
        <span className="block text-xs leading-tight text-muted">{label}</span>
      </span>
    </motion.div>
  );
}
