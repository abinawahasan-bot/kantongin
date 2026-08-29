"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { type EmblaCarouselType } from "embla-carousel";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { testimonials, type Testimonial } from "@/constants/testimonials";
import { cn } from "@/lib/utils";

const AUTOPLAY_DELAY = 4500;

const AVATAR_GRADIENTS = [
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-blue-600",
  "from-rose-500 to-pink-600",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

type TestimonialSlideProps = {
  testimonial: Testimonial;
  index: number;
};

function TestimonialSlide({ testimonial, index }: TestimonialSlideProps) {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  return (
    <article className="flex min-w-0 flex-[0_0_100%] items-center justify-center px-1 py-2">
      <div className="flex w-full max-w-3xl flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="text-gradient select-none font-serif text-6xl leading-none"
        >
          &ldquo;
        </span>
        <blockquote className="mt-6 text-xl font-medium italic leading-relaxed text-foreground lg:text-2xl">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
        <div
          role="img"
          aria-label={`Rating ${testimonial.rating} dari 5`}
          className="mt-8 flex items-center gap-1"
        >
          {Array.from({ length: 5 }, (_, starIndex) => (
            <Star
              key={starIndex}
              aria-hidden="true"
              className={cn(
                "size-5",
                starIndex < testimonial.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-border text-border"
              )}
            />
          ))}
        </div>
        <footer className="mt-8 flex flex-col items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "flex size-14 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-sm",
              gradient
            )}
          >
            {getInitials(testimonial.name)}
          </span>
          <div>
            <p className="text-base font-semibold text-foreground">{testimonial.name}</p>
            <p className="mt-0.5 text-sm text-muted">
              {testimonial.role} &middot; {testimonial.company}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <TrendingUp className="size-3.5" aria-hidden="true" />
              {testimonial.result}
            </p>
          </div>
        </footer>
      </div>
    </article>
  );
}

export function Testimonials() {
  const reduceMotion = useReducedMotion();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    reduceMotion
      ? []
      : [
          Autoplay({
            delay: AUTOPLAY_DELAY,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
    setScrollSnaps(api.scrollSnapList());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      emblaApi.plugins().autoplay?.play();
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    emblaApi.plugins().autoplay?.play();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    emblaApi.plugins().autoplay?.play();
  }, [emblaApi]);

  return (
    <section id="testimonials" className="relative scroll-mt-28 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Testimoni"
            size="display"
            title="Kata Mereka Tentang KantongIn"
            description="Bukan janji manis — dengar langsung dari UMKM, brand, dan startup yang bertumbuh bersama hasil kerja kami."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {testimonials.map((testimonial, index) => (
                <TestimonialSlide
                  key={testimonial.name}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-6">
            <div
              role="group"
              aria-label="Kemajuan autoplay"
              className="flex w-full max-w-md items-center justify-center gap-2"
            >
              {scrollSnaps.map((snap, index) => {
                const active = index === selectedIndex;
                return (
                  <button
                    key={snap}
                    type="button"
                    aria-label={`Tampilkan testimoni ${index + 1}`}
                    aria-current={active}
                    onClick={() => scrollTo(index)}
                    className={cn(
                      "relative overflow-hidden rounded-full bg-border transition-all duration-300",
                      active ? "h-2 w-16" : "h-1 w-7 opacity-60 hover:opacity-100"
                    )}
                  >
                    {active ? (
                      reduceMotion ? (
                        <span className="absolute inset-0 origin-left rounded-full bg-primary" />
                      ) : (
                        <motion.span
                          key={`${selectedIndex}-${index}`}
                          className="absolute inset-0 origin-left rounded-full bg-primary"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: AUTOPLAY_DELAY / 1000,
                            ease: "linear",
                          }}
                        />
                      )
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-5">
              <button
                type="button"
                aria-label="Testimoni sebelumnya"
                onClick={scrollPrev}
                disabled={!emblaApi}
                className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>

              <div role="group" aria-label="Navigasi testimoni" className="flex items-center gap-2">
                {scrollSnaps.map((snap, index) => {
                  const active = index === selectedIndex;
                  return (
                    <button
                      key={snap}
                      type="button"
                      aria-label={`Langsung ke testimoni ${index + 1}`}
                      aria-current={active}
                      onClick={() => scrollTo(index)}
                      className={cn(
                        "size-2.5 rounded-full transition-all duration-300",
                        active ? "bg-primary" : "bg-border hover:bg-muted"
                      )}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                aria-label="Testimoni berikutnya"
                onClick={scrollNext}
                disabled={!emblaApi}
                className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
