"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { GlowCard } from "@/components/common/GlowCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { flows, type Flow, type Step } from "@/constants/steps";
import { flowForAnchor, HOW_TAB_EVENT, type HowFlow } from "@/lib/howTabs";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function TimelineRow({ step, index }: { step: Step; index: number }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <li className="grid grid-cols-[3rem_1fr] gap-4 pb-8 sm:gap-6 last:pb-0">
      <div className="flex justify-center">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-background text-sm font-bold text-primary shadow-sm"
        >
          {number}
        </span>
      </div>
      <GlowCard className="p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Langkah {number}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-foreground">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
      </GlowCard>
    </li>
  );
}

function FlowTimeline({ flow }: { flow: Flow }) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          if (reduceMotion) {
            gsap.set(lineRef.current, { scaleY: 1 });
            return;
          }
          gsap.fromTo(
            lineRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top 70%",
                end: "bottom 60%",
                scrub: true,
              },
            }
          );
        }, rootRef);
      }
    );

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduceMotion]);

  return (
    <div ref={rootRef} className="mx-auto max-w-3xl">
      <div className="relative">
        <div
          ref={lineRef}
          aria-hidden="true"
          className="absolute bottom-1 left-6 top-1 w-px origin-top bg-gradient-to-b from-primary/70 via-primary/30 to-transparent"
        />
        <ul className="relative">
          {flow.steps.map((step, index) => (
            <TimelineRow key={step.title} step={step} index={index} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [activeId, setActiveId] = useState<Flow["id"]>("brand");

  useEffect(() => {
    const fromHash = flowForAnchor(window.location.hash);
    if (fromHash) setActiveId(fromHash);

    const onTabEvent = (event: Event) => {
      setActiveId((event as CustomEvent<HowFlow>).detail);
    };
    const onHashChange = () => {
      const flow = flowForAnchor(window.location.hash);
      if (flow) setActiveId(flow);
    };

    window.addEventListener(HOW_TAB_EVENT, onTabEvent);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener(HOW_TAB_EVENT, onTabEvent);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return (
    <section id="how-it-works" className="relative py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Cara Kerja"
          title="Bagaimana Cara Kerja KantongIn?"
          description="Dua alur kolaborasi yang jelas dan terukur — untuk brand yang ingin berkembang dan kreator yang ingin menghasilkan dari kontennya."
        />

        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Pilih alur kerja"
            className="inline-flex rounded-full border border-border bg-surface p-1"
          >
            {flows.map((flow) => {
              const active = flow.id === activeId;
              return (
                <button
                  key={flow.id}
                  type="button"
                  role="tab"
                  id={`how-tab-${flow.id}`}
                  aria-selected={active}
                  aria-controls={flow.anchorId}
                  onClick={() => setActiveId(flow.id)}
                  className={cn(
                    "relative rounded-full px-6 py-2.5 text-sm font-semibold transition-colors",
                    active ? "text-primary-foreground" : "text-muted hover:text-foreground"
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="how-it-works-tab-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative z-10">{flow.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1">
          {flows.map((flow) => {
            const active = flow.id === activeId;
            return (
              <div
                key={flow.id}
                id={flow.anchorId}
                role="tabpanel"
                aria-labelledby={`how-tab-${flow.id}`}
                aria-hidden={!active}
                className="col-start-1 row-start-1 scroll-mt-28"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {active ? (
                    <motion.div
                      key={flow.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      <FlowTimeline flow={flow} />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
