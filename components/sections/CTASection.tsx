"use client";

import { ArrowRight, MessagesSquare } from "lucide-react";
import type { MouseEvent } from "react";
import { MagneticButton } from "@/components/common/MagneticButton";
import { Particles } from "@/components/common/Particles";
import { Reveal } from "@/components/common/Reveal";
import { Button } from "@/components/ui/button";
import { useLenis } from "@/lib/lenis";

export function CTASection() {
  const { scrollTo, ready } = useLenis();

  const handleAnchor = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>, target: string) => {
    if (!document.querySelector(target) || !ready) return;
    event.preventDefault();
    scrollTo(target);
  };

  return (
    <section id="cta" className="relative py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-secondary via-secondary/95 to-primary/20 px-6 py-16 text-center sm:px-12 lg:py-24">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-primary/20 blur-3xl"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-accent/15 blur-3xl"
            />
            <Particles className="absolute inset-0 opacity-30" density={24} />

            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6">
              <h2 className="text-3xl font-bold tracking-tight text-background dark:text-foreground sm:text-4xl lg:text-5xl">
                Siap Tumbuh Bersama KantongIn?
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground dark:text-muted sm:text-lg">
                Mulai dari affiliate marketing, endorsement, hingga kolaborasi kreator — tim kami siap
                membantu brand dan UMKM mencapai hasil yang terukur. Konsultasi pertama gratis, tanpa
                komitmen.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                <MagneticButton
                  href="#contact"
                  onClick={(event) => handleAnchor(event, "#contact")}
                >
                  <Button
                    asChild
                    variant="primary"
                    size="lg"
                    className="rounded-full dark:bg-primary dark:text-primary-foreground"
                  >
                    <span className="gap-2">
                      Mulai Kampanye
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </Button>
                </MagneticButton>
                <MagneticButton
                  href="#faq"
                  onClick={(event) => handleAnchor(event, "#faq")}
                >
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="rounded-full bg-background text-foreground hover:bg-background/80 dark:bg-surface dark:text-foreground dark:hover:bg-surface/80"
                  >
                    <span className="gap-2">
                      <MessagesSquare className="size-4" aria-hidden="true" />
                      Hubungi Kami
                    </span>
                  </Button>
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
