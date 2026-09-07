"use client";

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

const icons: Record<string, LucideIcon> = {
  badgeCheck: BadgeCheck,
  barChart: BarChart3,
  rocket: Rocket,
  trendingUp: TrendingUp,
};

type CardProps = {
  value: Value;
  index: number;
};

function ValueCard({ value, index }: CardProps) {
  const Icon = icons[value.icon];
  const number = String(index + 1).padStart(2, "0");

  return (
    <Reveal delay={index * 0.1}>
      <GlowCard className="h-full p-6 sm:p-8">
        <div className="flex flex-col gap-5 h-full">
          {/* Top row: icon + number + badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-xl bg-primary/10 p-2.5 text-primary">
                {Icon ? <Icon className="size-5" aria-hidden="true" /> : null}
              </span>
              <span className="text-sm font-semibold tracking-[0.2em] text-muted-foreground">
                {number}
              </span>
            </div>
            <GlowCard className="rounded-full px-3 py-1.5">
              <span className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-foreground">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                {value.badge}
              </span>
            </GlowCard>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold tracking-tight text-foreground lg:text-2xl">
            {value.title}
          </h3>

          {/* Points list */}
          <ul className="flex flex-col gap-2.5 mt-auto">
            {value.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary/60" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </GlowCard>
    </Reveal>
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
          title="Mengapa Klien Memilih Kami"
          description="Kami membangun website yang cepat, responsif, dan dirancang untuk mendatangkan pelanggan — dengan proses yang transparan sejak awal."
        />

        <div className="mt-16 lg:mt-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {values.map((value, index) => (
              <ValueCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
