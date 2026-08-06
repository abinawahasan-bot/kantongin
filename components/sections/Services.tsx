"use client";

import {
  ArrowRight,
  Clapperboard,
  Handshake,
  Megaphone,
  Share2,
  Star,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { type MouseEvent } from "react";
import { GlowCard } from "@/components/common/GlowCard";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { services, type Service } from "@/constants/services";
import { useLenis } from "@/lib/lenis";

const icons: Record<string, LucideIcon> = {
  handshake: Handshake,
  megaphone: Megaphone,
  star: Star,
  users: Users,
  share2: Share2,
  target: Target,
  clapperboard: Clapperboard,
};

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

function CustomCtaCard({ onNavigate }: { onNavigate: (event: MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <Reveal delay={0.56} className="h-full sm:col-span-2 lg:col-span-3">
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
    if (!document.querySelector(target) || !ready) return;
    event.preventDefault();
    scrollTo(target);
  };

  const handleNavigate = (event: MouseEvent<HTMLButtonElement>) => {
    if (!document.querySelector("#contact") || !ready) return;
    event.preventDefault();
    scrollTo("#contact");
  };

  return (
    <section id="services" className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Layanan"
          title="Solusi Lengkap untuk Tumbuh Bersama"
          description="Dari affiliate marketing hingga content production, semua kebutuhan pemasaran digital brand dan UMKM ada di satu tempat — dirancang untuk hasil nyata."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              onLearnMore={(event) => handleAnchor(event, "#contact")}
            />
          ))}
          <CustomCtaCard onNavigate={handleNavigate} />
        </div>
      </div>
    </section>
  );
}
