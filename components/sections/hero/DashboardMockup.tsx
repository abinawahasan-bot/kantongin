"use client";

import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const PROJECTS = [
  {
    name: "RumahKreasi — Toko Online",
    status: "Selesai",
    tone: "bg-emerald-500",
  },
  {
    name: "NusaProperti — Landing Page",
    status: "On Progress",
    tone: "bg-amber-500",
  },
  {
    name: "FinanceHub — Web App",
    status: "Maintenance",
    tone: "bg-sky-500",
  },
];

const PERF_METRICS = [
  { label: "PageSpeed", value: "98", width: "98%" },
  { label: "SEO", value: "92", width: "92%" },
  { label: "Mobile", value: "100", width: "100%" },
];

const PERF_BARS = [86, 94, 98];

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
          <p className="text-xs font-semibold tracking-tight text-muted">kantongin • studio</p>
          <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-xl border border-border/70 bg-surface/90 p-4 dark:border-white/10 dark:bg-slate-950/70">
            <p className="text-xs font-medium text-muted">Proyek Aktif</p>
            <ul className="mt-3 space-y-2.5">
              {PROJECTS.map((project) => (
                <li key={project.name} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn("size-2 shrink-0 rounded-full", project.tone)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {project.name}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[0.65rem] font-semibold text-primary">
                    {project.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border/70 bg-surface/90 p-4 dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted">Performa Website</p>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[0.65rem] font-semibold text-accent">
                skor rata-rata
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {PERF_METRICS.map((metric) => (
                <li key={metric.label}>
                  <div className="flex items-center justify-between text-[0.7rem]">
                    <span className="font-medium text-muted">{metric.label}</span>
                    <span className="font-semibold text-foreground">{metric.value}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: metric.width }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex h-12 items-end gap-1.5">
              {PERF_BARS.map((height, index) => (
                <div
                  key={index}
                  style={{ height: `${height}%` }}
                  className={cn(
                    "flex-1 rounded-t-md",
                    index === PERF_BARS.length - 1 ? "bg-accent" : "bg-primary/40"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-3 -top-5 flex items-center gap-2 rounded-xl border border-primary/20 bg-background px-3 py-2 shadow-lg">
        <BadgeCheck className="size-3.5 text-primary" aria-hidden="true" />
        <span className="text-xs font-semibold text-foreground">Launch Minggu Ini</span>
      </div>
    </div>
  );
}