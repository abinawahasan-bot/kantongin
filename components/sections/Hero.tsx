"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowRight, Mouse } from "lucide-react";
import { useEffect, useRef, type MouseEvent } from "react";
import { AnimatedText } from "@/components/common/AnimatedText";
import { MagneticButton } from "@/components/common/MagneticButton";
import { Particles } from "@/components/common/Particles";
import { DashboardMockup } from "@/components/sections/hero/DashboardMockup";
import { KpiChip } from "@/components/sections/hero/KpiChip";
import { Button } from "@/components/ui/button";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { stats } from "@/constants/stats";
import { CTA_REASSURANCE } from "@/constants/copy";
import { trackConversion } from "@/lib/analytics";
import { useLenis } from "@/lib/lenis";
import { revealAndScroll } from "@/lib/reveal-section";

const SOCIAL_PROOF = stats.slice(0, 3).map((stat) => ({
  value: `${stat.value}${stat.suffix}`,
  label: stat.label,
}));

const SPRING = { stiffness: 120, damping: 20, mass: 0.5 } as const;

type AnchorTarget = MouseEvent<HTMLButtonElement | HTMLAnchorElement>;

export function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const { scrollTo, ready } = useLenis();
  const { x, y } = useMousePosition();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY, x, y]);

  const rotateX = useSpring(
    useTransform(mouseY, [-1, 1], reduceMotion ? [0, 0] : [6, -6]),
    SPRING
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-1, 1], reduceMotion ? [0, 0] : [-6, 6]),
    SPRING
  );

  useEffect(() => {
    if (reduceMotion) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        gsap.from(mockupRef.current, {
          opacity: 0,
          scale: 0.95,
          y: 24,
          duration: 1,
          ease: "power3.out",
          delay: 0.35,
        });
      }, sectionRef);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduceMotion]);

  const handleAnchor = (event: AnchorTarget, target: string) => {
    if (!ready) return;
    event.preventDefault();
    if (target === "#contact") {
      trackConversion("cta_whatsapp_click", { section: "hero" });
    }
    void revealAndScroll(target, (t) => scrollTo(t));
  };

  const handleScrollDown = () => {
    if (!ready) return;
    scrollTo("#services");
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <Particles className="absolute inset-0 opacity-25" />
        <div className="hero-mesh absolute inset-0" />
        <div className="animate-blob-drift absolute -left-32 -top-32 size-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="animate-blob-drift absolute -right-24 top-1/4 size-[24rem] rounded-full bg-accent/15 blur-3xl [animation-delay:-6s]" />
        <div className="animate-blob-drift absolute -bottom-24 left-1/3 size-[22rem] rounded-full bg-primary/10 blur-3xl [animation-delay:-12s]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 px-4 pb-28 pt-32 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-24">
        <div>
          <AnimatedText
            as="h1"
            text="Website Profesional yang Mendatangkan Pelanggan"
            highlight="Mendatangkan Pelanggan"
            className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Jasa pembuatan website untuk UMKM, startup, dan brand — landing page,
            company profile, toko online, hingga web app. Responsif, cepat, dan
            SEO-ready dalam anggaran Anda.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <MagneticButton
              href="#contact"
              onClick={(event) => handleAnchor(event, "#contact")}
            >
              <Button asChild variant="primary" size="lg" className="rounded-full">
                <span className="gap-2">
                  Konsultasi Gratis
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Button>
            </MagneticButton>
            <a
              href="#how-it-works"
              onClick={(event) => handleAnchor(event, "#how-it-works")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-primary"
            >
              Lihat cara kerjanya
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
          </div>

          <p className="mt-4 text-sm text-muted">{CTA_REASSURANCE}</p>

          <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            {SOCIAL_PROOF.map((item) => (
              <li key={item.label} className="flex items-baseline gap-2">
                <span className="text-base font-bold text-foreground">{item.value}</span>
                <span className="text-sm text-muted">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <motion.div
            style={{ rotateX, rotateY, transformPerspective: 1200 }}
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full max-w-md lg:max-w-lg"
          >
            <div ref={mockupRef} className="relative">
              <DashboardMockup />
              <KpiChip
                value="98%"
                label="Klien Puas"
                className="left-0 top-10 hidden lg:flex"
              />
              <KpiChip
                value="100+"
                label="Website Selesai"
                floatDelay={1.2}
                className="-right-2 bottom-12 hidden lg:flex"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <button
          type="button"
          onClick={handleScrollDown}
          aria-label="Scroll ke bawah"
          className="inline-flex flex-col items-center gap-1.5 text-muted transition-colors hover:text-foreground"
        >
          <span className="text-[0.7rem] font-semibold uppercase tracking-widest">Scroll</span>
          <motion.span
            aria-hidden="true"
            animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Mouse className="size-5" />
          </motion.span>
        </button>
      </div>
    </section>
  );
}
