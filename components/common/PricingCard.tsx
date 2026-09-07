import {
  ArrowRight,
  Building2,
  Check,
  LayoutDashboard,
  Rocket,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import type { MouseEvent } from "react";
import { GlowCard } from "@/components/common/GlowCard";
import { Reveal } from "@/components/common/Reveal";
import { TrackLink } from "@/components/common/TrackLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PricingPlan } from "@/constants/pricing";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  rocket: Rocket,
  building2: Building2,
  shoppingBag: ShoppingBag,
  layoutDashboard: LayoutDashboard,
};

type PricingCardProps = {
  plan: PricingPlan;
  index: number;
  ctaHref: string;
  ctaTarget?: string;
  /** Saat diisi, klik CTA mengirim event konversi (dipakai dari server component). */
  trackEvent?: "cta_whatsapp_click";
  trackSection?: string;
  onCtaClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function PricingCard({
  plan,
  index,
  ctaHref,
  ctaTarget,
  trackEvent,
  trackSection,
  onCtaClick,
}: PricingCardProps) {
  const Icon = icons[plan.icon];
  const ctaLink = trackEvent ? (
    <TrackLink
      href={ctaHref}
      event={trackEvent}
      payload={{ section: trackSection ?? "pricing" }}
      target={ctaTarget}
      rel={ctaTarget === "_blank" ? "noopener noreferrer" : undefined}
    >
      {plan.cta}
      <ArrowRight className="size-4" aria-hidden="true" />
    </TrackLink>
  ) : (
    <a
      href={ctaHref}
      target={ctaTarget}
      rel={ctaTarget === "_blank" ? "noopener noreferrer" : undefined}
      onClick={onCtaClick}
    >
      {plan.cta}
      <ArrowRight className="size-4" aria-hidden="true" />
    </a>
  );
  return (
    <Reveal delay={index * 0.1} className="h-full">
      <div
        className={cn(
          "h-full rounded-3xl transition-all duration-300 will-change-transform hover:-translate-y-1.5",
          plan.highlight
            ? "lg:shadow-[0_0_40px_-12px_rgba(34,197,94,0.5)] hover:shadow-[0_0_50px_-12px_rgba(34,197,94,0.6)]"
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

            <div className="flex min-h-6 items-center justify-end">
              {plan.highlight ? (
                <Badge variant="default" className="rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide">
                  Paling Populer
                </Badge>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-xl bg-primary/10 p-2.5 text-primary">
                {Icon ? <Icon className="size-5" aria-hidden="true" /> : null}
              </span>
              <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-foreground">
                {plan.price}
              </span>
              {plan.period ? (
                <span className="text-sm font-medium text-muted">{plan.period}</span>
              ) : null}
            </div>

            <p className="line-clamp-2 text-sm leading-relaxed text-muted">{plan.description}</p>

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
                {ctaLink}
              </Button>
            </div>
          </div>
        </GlowCard>
      </div>
    </Reveal>
  );
}