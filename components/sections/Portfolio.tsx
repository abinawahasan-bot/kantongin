"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState, type MouseEvent } from "react";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
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

const SIZES_CARD =
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

function ProjectPhoto({
  project,
  className,
  decorative,
  zoom,
}: {
  project: PortfolioProject;
  className?: string;
  decorative?: boolean;
  zoom?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={project.image}
        alt={decorative ? "" : project.imageAlt}
        fill
        sizes={SIZES_CARD}
        className={cn(
          "object-cover",
          zoom && "transition-transform duration-500 ease-out group-hover:scale-105"
        )}
      />
    </div>
  );
}

type PortfolioCardProps = {
  project: PortfolioProject;
  onOpen: (project: PortfolioProject) => void;
};

function PortfolioCard({ project, onOpen }: PortfolioCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition-shadow duration-300 hover:shadow-xl",
        project.featured && "md:col-span-2"
      )}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(project);
        }
      }}
      aria-label={`Lihat detail proyek ${project.title}`}
    >
      <div className={cn("relative cursor-pointer", project.featured ? "h-64 sm:h-72" : "h-56 sm:h-64")}>
        <div className={cn("absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r", project.gradient)} />
        <ProjectPhoto project={project} zoom className="h-full" />
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 via-black/30 to-transparent px-5 pb-4 pt-10">
          <p
            className={cn(
              "font-semibold leading-snug text-white drop-shadow-sm",
              project.featured ? "text-xl" : "text-base"
            )}
          >
            {project.title}
          </p>
        </div>
        <span className="pointer-events-none absolute left-5 top-3 z-10 inline-flex items-center rounded-full bg-gradient-to-r px-3 py-1 text-xs font-bold text-white shadow-sm">
          {project.result}
        </span>
        <span className="pointer-events-none absolute bottom-4 right-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white opacity-100 backdrop-blur-sm transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
          Lihat Detail
        </span>
      </div>
      <div className="mt-auto flex items-center justify-between gap-4 border-t border-border/60 px-5 py-4">
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
          title="Karya Website yang Sudah Meluncur"
          description="Kumpulan website yang telah kami rancang dan luncurkan untuk UMKM, brand, dan startup — dibuktikan dengan hasil yang nyata, bukan sekadar janji."
        />
        <p className="mt-6 text-center text-sm text-muted">
          Catatan: contoh proyek ini ilustratif dan akan diperbarui saat klien
          nyata tayang.
        </p>

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

        <div className="relative mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="mb-6"
              >
                <Reveal className="h-full">
                  <PortfolioCard
                    project={project}
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
            <div className="relative -mx-6 -mt-6 mb-4 h-40 overflow-hidden rounded-t-lg">
              <ProjectPhoto project={selected} className="h-full" decorative />
              <div className={cn("absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t opacity-80", selected.gradient)} />
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
