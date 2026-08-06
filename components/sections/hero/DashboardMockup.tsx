"use client";

import { BadgeCheck, Star, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const REVENUE_BARS = [38, 52, 44, 62, 50, 72, 86];

const CREATORS = [
  {
    initials: "AR",
    name: "Alya Rahma",
    niche: "Skincare & Lifestyle",
    rating: "4.9",
    classes: "from-primary to-emerald-500",
  },
  {
    initials: "RD",
    name: "Raka Devan",
    niche: "Gadget & Review",
    rating: "4.8",
    classes: "from-accent to-cyan-400",
  },
  {
    initials: "NS",
    name: "Nadia Safitri",
    niche: "Food & Travel",
    rating: "4.9",
    classes: "from-violet-500 to-accent",
  },
];

type DashboardMockupProps = {
  className?: string;
};

export function DashboardMockup({ className }: DashboardMockupProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-[3rem] bg-primary/20 blur-3xl dark:bg-primary/10"
      />

      <div className="relative rounded-2xl border border-white/40 bg-white/70 shadow-[0_28px_90px_-30px_rgba(15,23,42,0.4)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5 dark:border-white/10">
          <div className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-red-400" />
            <span aria-hidden="true" className="size-2.5 rounded-full bg-amber-400" />
            <span aria-hidden="true" className="size-2.5 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs font-semibold tracking-tight text-muted">kantongin • dashboard</p>
          <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-xl border border-border/70 bg-surface/90 p-4 dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted">Total Pendapatan</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">Rp 248,9 Jt</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                <TrendingUp className="size-3.5" aria-hidden="true" />
                +32,5%
              </span>
            </div>
            <div className="mt-4 flex h-20 items-end gap-1.5">
              {REVENUE_BARS.map((height, index) => (
                <div
                  key={index}
                  style={{ height: `${height}%` }}
                  className={cn(
                    "flex-1 rounded-t-md",
                    index === REVENUE_BARS.length - 1 ? "bg-accent" : "bg-primary/40"
                  )}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[0.65rem] text-muted">
              <span>Jan</span>
              <span>Jun</span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-surface/90 p-4 dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted">Kreator Aktif</p>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[0.65rem] font-semibold text-accent">
                minggu ini
              </span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {CREATORS.map((creator) => (
                <li key={creator.name} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[0.65rem] font-bold text-white",
                      creator.classes
                    )}
                  >
                    {creator.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{creator.name}</p>
                    <p className="truncate text-[0.65rem] text-muted">{creator.niche}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[0.7rem] font-medium text-muted">
                    <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                    {creator.rating}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="absolute -right-3 -top-5 flex items-center gap-2 rounded-xl border border-primary/20 bg-background px-3 py-2 shadow-lg">
        <Zap className="size-3.5 text-primary" aria-hidden="true" />
        <span className="text-xs font-semibold text-foreground">Promo brand baru · 2x1</span>
      </div>
    </div>
  );
}
