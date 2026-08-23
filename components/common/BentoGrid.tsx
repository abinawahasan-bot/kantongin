import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SPAN_CLASSES = {
  half: "md:col-span-3",
  third: "md:col-span-2",
  wide: "md:col-span-4",
  full: "md:col-span-6",
} as const;

type BentoItemSpan = keyof typeof SPAN_CLASSES;

type BentoGridProps = { children: ReactNode; className?: string };
type BentoItemProps = {
  children: ReactNode;
  span?: BentoItemSpan;
  className?: string;
};

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-6", className)}>{children}</div>
  );
}

export function BentoItem({ children, span = "half", className }: BentoItemProps) {
  return (
    <div className={cn("min-w-0", SPAN_CLASSES[span], className)}>{children}</div>
  );
}
