"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  portfolioCategories,
  projects,
  type PortfolioCategory,
  type PortfolioProject,
} from "@/constants/portfolio";
import { useLenis } from "@/lib/lenis";
import { revealAndScroll } from "@/lib/reveal-section";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type Filter = "Semua" | PortfolioCategory;

const FILTERS: Filter[] = ["Semua", ...portfolioCategories];

const PANEL_HEIGHTS = ["h-44 sm:h-52", "h-56 sm:h-64", "h-48 sm:h-60"];

type PortfolioCardProps = {
  project: PortfolioProject;
  index: number;
  onOpen: (project: PortfolioProject) => void;
};

function PortfolioCard({ project, index, onOpen }: PortfolioCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition-shadow duration-300 hover:shadow-xl">
      <div
        className={cn(
          "relative bg-gradient-to-br",
          project.gradient,
          PANEL_HEIGHTS[index % PANEL_HEIGHTS.length]
        )}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/20 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="absolute right-4 top-3 select-none font-serif text-5xl font-bold leading-none text-white/25"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/25 to-transparent p-5 pb-14 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
          <p className="text-base font-semibold leading-snug text-white">
            {project.title}
          </p>
          <button
            type="button"
            aria-label={`Lihat detail proyek ${project.title}`}
            onClick={() => onOpen(project)}
            className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-sm transition-all duration-300 hover:bg-white/90 md:translate-y-1 md:group-hover:translate-y-0 md:focus-within:translate-y-0"
          >
            Lihat Detail
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </button>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
          <span className="inline-flex items-center rounded-full border border-white/30 bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {project.result}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-border/60 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {project.category}
        </p>
        <ArrowUpRight
          aria-hidden="true"
          className="size-5 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
        />
      </div>
    </article>
  );
}

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Semua");
  const [selected, setSelected] = useState<PortfolioProject | null>(null);
  const { scrollTo, ready } = useLenis();

  const filteredProjects =
    activeFilter === "Semua"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const handleContactClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setSelected(null);
    if (!ready) return;
    event.preventDefault();
    void revealAndScroll("#contact", (t) => scrollTo(t));
  };

  return (
    <section
      id="portfolio"
      className="glow-section relative scroll-mt-28 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Portofolio"
          title="Hasil Nyata, Kampanye Terukur"
          description="Kumpulan kampanye yang telah kami jalankan bersama brand dan kreator — dibuktikan dengan hasil yang nyata, bukan sekadar janji."
        />

        <div
          role="group"
          aria-label="Filter portofolio"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {FILTERS.map((filter) => {
            const active = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "rounded-full border px-5 py-2 text-sm font-semibold transition-colors duration-200",
                  active
                    ? "border-transparent bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30"
                    : "border-border bg-surface text-muted hover:border-primary/40 hover:text-foreground"
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="relative mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="mb-6 break-inside-avoid"
              >
                <Reveal className="h-full">
                  <PortfolioCard
                    project={project}
                    index={projects.indexOf(project)}
                    onOpen={(project) => setSelected(project)}
                  />
                </Reveal>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        {selected ? (
          <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
            <div
              className={cn(
                "-mx-6 -mt-6 mb-4 flex h-40 items-end rounded-t-lg bg-gradient-to-br px-6 pb-5",
                selected.gradient
              )}
            >
              <div>
                <Badge className="border-white/40 bg-white/20 text-white backdrop-blur-sm">
                  {selected.category}
                </Badge>
                <p className="mt-2 text-2xl font-bold text-white drop-shadow-sm">
                  {selected.result}
                </p>
              </div>
            </div>
            <DialogHeader className="items-start text-left">
              <DialogTitle>{selected.title}</DialogTitle>
              <DialogDescription>{selected.description}</DialogDescription>
            </DialogHeader>
            {selected.metrics && selected.metrics.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {selected.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-border bg-surface px-2 py-4 text-center"
                  >
                    <p className="text-lg font-bold text-primary">{metric.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
            <Button
              asChild
              variant="primary"
              size="lg"
              className="mt-2 w-full rounded-full"
            >
              <a href="#contact" onClick={handleContactClick}>
                Mulai Proyek Serupa
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </DialogContent>
        ) : null}
      </Dialog>
    </section>
  );
}
