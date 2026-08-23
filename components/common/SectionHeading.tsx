"use client";

import { cn } from "@/lib/utils";
import { AnimatedText } from "@/components/common/AnimatedText";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  size?: "default" | "display";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  size = "default",
}: SectionHeadingProps) {
  const centered = align === "center";
  const sizeClasses =
    size === "display"
      ? "text-[clamp(2rem,5vw,3.25rem)] leading-[1.05]"
      : "text-3xl sm:text-4xl md:text-5xl";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        centered ? "items-center text-center" : "items-start text-left"
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary",
            centered && "justify-center"
          )}
        >
          <span className="h-px w-8 bg-primary" aria-hidden="true" />
          {eyebrow}
        </span>
      ) : null}
      <AnimatedText
        as="h2"
        text={title}
        className={cn("font-bold tracking-tight text-foreground", sizeClasses)}
      />
      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
