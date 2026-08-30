"use client";

import { ArrowRight, Globe, MessageSquare, Repeat, ShieldCheck } from "lucide-react";
import type { MouseEvent } from "react";
import { PricingCard } from "@/components/common/PricingCard";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { pricingPlans } from "@/constants/pricing";
import { useLenis } from "@/lib/lenis";
import { revealAndScroll } from "@/lib/reveal-section";

export function Pricing() {
  const { scrollTo, ready } = useLenis();

  const handleAnchor = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
    if (!ready) return;
    event.preventDefault();
    void revealAndScroll(target, (t) => scrollTo(t));
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
            <PricingCard
              key={plan.name}
              plan={plan}
              index={index}
              ctaHref="#contact"
              onCtaClick={(event) => handleAnchor(event, "#contact")}
            />
          ))}
        </div>

        <Reveal delay={0.1}>
          <ul className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            {[
              { icon: ShieldCheck, label: "Tanpa biaya tersembunyi" },
              { icon: MessageSquare, label: "Gratis konsultasi" },
              { icon: Repeat, label: "Gratis revisi" },
              { icon: Globe, label: "Bantuan domain & hosting" },
            ].map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted-foreground"
              >
                <Icon className="size-4 text-primary" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </Reveal>

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
