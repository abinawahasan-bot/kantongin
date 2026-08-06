"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import { ArrowRight, Mouse } from "lucide-react";
import { useEffect, useRef, type MouseEvent } from "react";
import { AnimatedText } from "@/components/common/AnimatedText";
import { MagneticButton } from "@/components/common/MagneticButton";
import { Particles } from "@/components/common/Particles";
import { DashboardMockup } from "@/components/sections/hero/DashboardMockup";
import { Button } from "@/components/ui/button";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

const TRUST_CHIPS = [
  { label: "350+ kampanye", dot: "bg-primary" },
  { label: "850+ kreator", dot: "bg-accent" },
] as const;

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

    const ctx = gsap.context(() => {
      gsap.from(mockupRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 24,
        duration: 1,
        ease: "power3.out",
        delay: 0.35,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  const handleAnchor = (event: AnchorTarget, target: string) => {
    if (!document.querySelector(target) || !ready) return;
    event.preventDefault();
    scrollTo(target);
  };

  const handleScrollDown = () => {
    if (!document.querySelector("#services") || !ready) return;
    scrollTo("#services");
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <Particles className="absolute inset-0 opacity-40" />
        <div className="hero-mesh absolute inset-0" />
        <div className="animate-blob-drift absolute -left-32 -top-32 size-[28rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="animate-blob-drift absolute -right-24 top-1/4 size-[24rem] rounded-full bg-accent/15 blur-3xl [animation-delay:-6s]" />
        <div className="animate-blob-drift absolute -bottom-24 left-1/3 size-[22rem] rounded-full bg-primary/10 blur-3xl [animation-delay:-12s]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 px-4 pb-28 pt-32 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-24">
        <div>
          <AnimatedText
            text="Tumbuhkan Bisnismu Lewat Affiliate, Promosi & Kolaborasi Kreator"
            className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            KantongIn menghubungkan brand dan UMKM dengan jaringan kreator terkurasi untuk
            affiliate marketing, open promotion, dan endorsement — bayar sesuai performa, tanpa
            buang anggaran iklan.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton
              href="#contact"
              onClick={(event) => handleAnchor(event, "#contact")}
            >
              <Button asChild variant="primary" size="lg" className="rounded-full">
                <span className="gap-2">
                  Mulai Kampanye
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Button>
            </MagneticButton>
            <MagneticButton
              href="#affiliate"
              onClick={(event) => handleAnchor(event, "#affiliate")}
            >
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <span>Gabung Affiliate</span>
              </Button>
            </MagneticButton>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            {TRUST_CHIPS.map((chip) => (
              <li key={chip.label} className="flex items-center gap-2.5 text-sm font-medium text-muted">
                <span aria-hidden="true" className={cn("size-2 rounded-full", chip.dot)} />
                {chip.label}
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
            <div ref={mockupRef}>
              <DashboardMockup />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <button
          type="button"
          onClick={handleScrollDown}
          aria-label="Gulir ke bawah"
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
