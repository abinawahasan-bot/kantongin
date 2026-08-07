"use client";

import { ArrowRight, Check } from "lucide-react";
import type { MouseEvent } from "react";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { GlowCard } from "@/components/common/GlowCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pricingPlans, type PricingPlan } from "@/constants/pricing";
import { useLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

type PricingCardProps = {
  plan: PricingPlan;
  index: number;
  onAnchor: (event: MouseEvent<HTMLAnchorElement>, target: string) => void;
};

function PricingCard({ plan, index, onAnchor }: PricingCardProps) {
  return (
    <Reveal delay={index * 0.1} className="h-full">
      <div
        className={cn(
          "h-full rounded-3xl transition-all duration-300 will-change-transform hover:-translate-y-1.5",
          plan.highlight
            ? "lg:scale-105 lg:shadow-[0_0_40px_-12px_rgba(34,197,94,0.5)] hover:shadow-[0_0_50px_-12px_rgba(34,197,94,0.6)]"
            : "hover:shadow-xl"
        )}
      >
        <GlowCard className="h-full rounded-3xl">
          <div
            className={cn(
              "relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl p-8",
              plan.highlight && "bg-primary/[0.05] dark:bg-primary/[0.08]"
            )}
          >
            {plan.highlight ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-primary/10 blur-3xl"
              />
            ) : null}

            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
              {plan.highlight ? (
                <Badge variant="default" className="rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide">
                  Paling Populer
                </Badge>
              ) : null}
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-foreground">
                {plan.price}
              </span>
              {plan.period ? (
                <span className="text-sm font-medium text-muted">{plan.period}</span>
              ) : null}
            </div>

            <p className="text-sm leading-relaxed text-muted">{plan.description}</p>

            <div aria-hidden="true" className="h-px w-full bg-border/70" />

            <ul className="flex flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10"
                  >
                    <Check className="size-3 text-primary" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-2">
              <Button
                asChild
                variant={plan.highlight ? "primary" : "outline"}
                size="lg"
                className="w-full rounded-full"
              >
                <a href="#contact" onClick={(event) => onAnchor(event, "#contact")}>
                  {plan.cta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </GlowCard>
      </div>
    </Reveal>
  );
}

export function Pricing() {
  const { scrollTo, ready } = useLenis();

  const handleAnchor = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
    if (!document.querySelector(target) || !ready) return;
    event.preventDefault();
    scrollTo(target);
  };

  return (
    <section id="pricing" className="relative scroll-mt-28 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Harga"
            title="Paket yang Sesuai Kebutuhan Anda"
            description="Pilih paket yang paling cocok dengan tahap pertumbuhan bisnis Anda — transparan, tanpa biaya tersembunyi, dan siap disesuaikan kapan saja."
          />
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl items-stretch gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} onAnchor={handleAnchor} />
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-12 text-center text-sm text-muted">
            Butuh skala lebih besar?{" "}
            <a
              href="#contact"
              onClick={(event) => handleAnchor(event, "#contact")}
              className="group inline-flex items-center gap-1 font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
            >
              Hubungi tim kami
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
