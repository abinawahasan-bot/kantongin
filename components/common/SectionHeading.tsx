"use client";

import { cn } from "@/lib/utils";
import { AnimatedText } from "@/components/common/AnimatedText";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const centered = align === "center";

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
        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
      />
      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
