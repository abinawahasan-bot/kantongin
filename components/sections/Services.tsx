"use client";

import {
  ArrowRight,
  Building2,
  LayoutTemplate,
  MonitorSmartphone,
  ShoppingCart,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { type MouseEvent } from "react";
import { BentoGrid, BentoItem } from "@/components/common/BentoGrid";
import { GlowCard } from "@/components/common/GlowCard";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { services, type Service } from "@/constants/services";
import { useLenis } from "@/lib/lenis";
import { revealAndScroll } from "@/lib/reveal-section";

const icons: Record<string, LucideIcon> = {
  shoppingCart: ShoppingCart,
  layoutTemplate: LayoutTemplate,
  building2: Building2,
  monitorSmartphone: MonitorSmartphone,
  wrench: Wrench,
};

function ServiceIndex({ value }: { value: number }) {
  return (
    <span aria-hidden="true" className="text-xs font-bold tracking-[0.2em] text-primary/50">
      {String(value).padStart(2, "0")}
    </span>
  );
}

type ServiceCardProps = {
  service: Service;
  index: number;
  onLearnMore: (event: MouseEvent<HTMLAnchorElement>) => void;
};

function ServiceCard({ service, index, onLearnMore }: ServiceCardProps) {
  const Icon = icons[service.icon];

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <GlowCard className="h-full">
        <div className="flex h-full flex-col gap-4 p-6">
          <ServiceIndex value={index + 1} />
          <span className="inline-flex w-fit rounded-xl bg-primary/10 p-3 text-primary transition-transform duration-300 group-hover:scale-110">
            {Icon ? <Icon className="size-6" aria-hidden="true" /> : null}
          </span>
          <h3 className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
            {service.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted">{service.description}</p>
          {service.points ? (
            <ul className="mt-auto space-y-1.5 pt-2">
              {service.points.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-primary/60" />
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
          <a
            href="#contact"
            onClick={onLearnMore}
            className="mt-auto inline-flex w-fit items-center gap-1.5 pt-4 text-sm font-semibold text-primary"
          >
            <span className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100">
              Pelajari
            </span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </GlowCard>
    </Reveal>
  );
}

function FlagshipCard({
  service,
  onLearnMore,
}: Omit<ServiceCardProps, "index">) {
  const Icon = icons[service.icon];

  return (
    <Reveal className="h-full">
      <GlowCard className="h-full">
        <div className="flex h-full flex-col gap-6 p-6">
          <ServiceIndex value={1} />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <span className="inline-flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {Icon ? <Icon className="size-8" aria-hidden="true" /> : null}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {service.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                {service.description}
              </p>
                {service.points ? (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <a
                  href="#contact"
                  onClick={onLearnMore}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                >
                  <span className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100">
                    Pelajari
                  </span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </div>
          </div>
        </div>
      </GlowCard>
    </Reveal>
  );
}

function CustomCtaCard({ onNavigate }: { onNavigate: (event: MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <Reveal delay={0.56} className="h-full">
      <GlowCard className="h-full">
        <div className="relative flex h-full flex-col items-center gap-5 overflow-hidden bg-gradient-to-br from-primary/[0.07] via-transparent to-accent/[0.07] p-8 text-center sm:p-12">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 size-48 rounded-full bg-primary/15 blur-3xl"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-16 size-48 rounded-full bg-accent/10 blur-3xl"
          />
          <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Butuh solusi yang lebih spesifik?
          </h3>
          <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Tidak semua kebutuhan brand sama. Ceritakan tujuan dan tantangan bisnismu — tim kami akan
            menyusun paket layanan custom yang sesuai anggaran dan targetmu.
          </p>
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onNavigate}
            className="mt-2 rounded-full"
          >
            <span className="gap-2">
              Konsultasi Gratis
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </Button>
        </div>
      </GlowCard>
    </Reveal>
  );
}

export function Services() {
  const { scrollTo, ready } = useLenis();

  const handleAnchor = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
    if (!ready) return;
    event.preventDefault();
    void revealAndScroll(target, (t) => scrollTo(t));
  };

  const handleNavigate = (event: MouseEvent<HTMLButtonElement>) => {
    if (!ready) return;
    event.preventDefault();
    void revealAndScroll("#contact", (t) => scrollTo(t));
  };

  return (
    <section id="services" className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Layanan"
          title="Semua Jenis Website yang Anda Butuhkan"
          description="Dari landing page hingga toko online dan web app — satu mitra untuk kebutuhan digital bisnis Anda, dikerjakan dari nol hingga meluncur."
        />

        <BentoGrid className="mt-14">
          <BentoItem span="full">
            <FlagshipCard
              service={services[0]}
              onLearnMore={(event) => handleAnchor(event, "#contact")}
            />
          </BentoItem>
          {services.slice(1).map((service, i) => (
            <BentoItem key={service.title} span="third">
              <ServiceCard
                service={service}
                index={i + 1}
                onLearnMore={(event) => handleAnchor(event, "#contact")}
              />
            </BentoItem>
          ))}
          <BentoItem span="full">
            <CustomCtaCard onNavigate={handleNavigate} />
          </BentoItem>
        </BentoGrid>
      </div>
    </section>
  );
}
