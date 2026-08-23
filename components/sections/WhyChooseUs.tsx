"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  BarChart3,
  Rocket,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { GlowCard } from "@/components/common/GlowCard";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { values, type Value } from "@/constants/values";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  badgeCheck: BadgeCheck,
  barChart: BarChart3,
  rocket: Rocket,
  trendingUp: TrendingUp,
};

const CONNECTOR_CLIP_ID = "why-connector-clip";

const CONNECTOR_PATH =
  "M50 0 C 78 56, 78 170, 50 225 C 22 280, 22 395, 50 450 C 78 505, 78 620, 50 675 C 22 730, 22 845, 50 900";

function Connector() {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 900"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-y-6 left-1/2 hidden w-[38rem] max-w-full -translate-x-1/2 lg:block"
    >
      <defs>
        <clipPath id={CONNECTOR_CLIP_ID}>
          <motion.rect
            x={0}
            y={0}
            width={100}
            initial={{ height: reduceMotion ? 900 : 0 }}
            whileInView={{ height: 900 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </clipPath>
      </defs>
      <path
        d={CONNECTOR_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 10"
        vectorEffect="non-scaling-stroke"
        className="text-primary/20"
      />
      <path
        d={CONNECTOR_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 10"
        vectorEffect="non-scaling-stroke"
        clipPath={`url(#${CONNECTOR_CLIP_ID})`}
        className="text-primary/50"
      />
    </svg>
  );
}

type RowProps = {
  value: Value;
  index: number;
};

function ValueRow({ value, index }: RowProps) {
  const Icon = icons[value.icon];
  const reversed = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal
        direction={reversed ? "right" : "left"}
        delay={index * 0.1}
        className={cn(reversed && "lg:order-2")}
      >
        <div className="flex items-center gap-4">
          <span className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
            {Icon ? <Icon className="size-6" aria-hidden="true" /> : null}
          </span>
          <span className="text-sm font-semibold tracking-[0.2em] text-muted-foreground">
            {number}
          </span>
        </div>
        <h3 className="mt-6 max-w-md text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          {value.title}
        </h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
          {value.description}
        </p>
      </Reveal>

      <Reveal
        direction={reversed ? "left" : "right"}
        delay={index * 0.1 + 0.12}
        className={cn(reversed && "lg:order-1")}
      >
        <div
          className={cn(
            "relative flex min-h-64 items-center justify-center overflow-hidden rounded-3xl p-10 lg:min-h-72 lg:p-14",
            reversed
              ? "bg-gradient-to-br from-accent/10 via-transparent to-primary/10"
              : "bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute size-40 rounded-full blur-3xl",
              reversed ? "-right-12 -top-12 bg-accent/15" : "-left-12 -top-12 bg-primary/15"
            )}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 left-8 select-none text-7xl font-black leading-none text-foreground/5 lg:left-12 lg:text-8xl"
          >
            {number}
          </span>
          {Icon ? (
            <Icon
              className="relative size-20 text-primary/80 lg:size-24"
              strokeWidth={1.25}
              aria-hidden="true"
            />
          ) : null}
          <GlowCard
            className={cn(
              "absolute rounded-full px-4 py-2",
              reversed ? "right-6 top-6" : "bottom-6 left-6"
            )}
          >
            <span className="flex items-center gap-2 whitespace-nowrap text-xs font-semibold text-foreground">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
              {value.badge}
            </span>
          </GlowCard>
        </div>
      </Reveal>
    </div>
  );
}

export function WhyChooseUs() {
  return (
    <section id="why" className="relative py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          size="display"
          eyebrow="Kenapa KantongIn"
          title="Mengapa Brand Memilih Kami"
          description="Sistem kolaborasi terkurasi yang transparan dan berorientasi hasil — bukan sekadar penghubung brand dan kreator."
        />

        <div className="relative mt-16 lg:mt-24">
          <Connector />
          <div className="space-y-20 lg:space-y-28">
            {values.map((value, index) => (
              <ValueRow key={value.title} value={value} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
