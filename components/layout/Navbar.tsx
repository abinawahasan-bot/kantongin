"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ChevronDown, Menu } from "lucide-react";
import { useRef, useState, type MouseEvent } from "react";
import { Logo } from "@/components/common/Logo";
import { MagneticButton } from "@/components/common/MagneticButton";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navItems, type MegaColumn, type NavItem } from "@/constants/navigation";
import { isHowFlowAnchor, switchHowFlow } from "@/lib/howTabs";
import { useLenis } from "@/lib/lenis";
import { revealAndScroll } from "@/lib/reveal-section";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type DesktopNavItemProps = {
  item: NavItem;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

function DesktopNavItem({ item, onNavigate }: DesktopNavItemProps) {
  return (
    <li>
      <a
        href={item.href}
        onClick={(event) => onNavigate(event, item.href)}
        className="rounded-md px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-foreground"
      >
        {item.label}
      </a>
    </li>
  );
}

function DesktopMegaItem({ item, onNavigate }: DesktopNavItemProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);

  if (!item.mega) return null;

  const close = () => setOpen(false);

  return (
    <li
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!(event.relatedTarget instanceof Node) || !wrapperRef.current?.contains(event.relatedTarget)) {
          close();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          close();
          triggerRef.current?.focus();
        }
      }}
    >
      <a
        ref={triggerRef}
        href={item.href}
        aria-haspopup="true"
        aria-expanded={open}
        onFocus={() => setOpen(true)}
        onClick={(event) => onNavigate(event, item.href)}
        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-foreground"
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </a>

      <AnimatePresence>
        {open ? (
          <div key="mega-panel" className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
            <motion.div
              role="menu"
              aria-label={item.label}
              className="w-[560px] rounded-2xl border border-border bg-surface/95 p-4 shadow-xl backdrop-blur"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <div className="grid grid-cols-2 gap-6">
                {item.mega.map((column: MegaColumn) => (
                  <div key={column.title}>
                    <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
                      {column.title}
                    </p>
                    <ul className="space-y-1">
                      {column.items.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            role="menuitem"
                            onClick={(event) => onNavigate(event, link.href)}
                            className="block rounded-lg px-3 py-2 text-sm text-foreground/75 transition-colors hover:bg-background hover:text-foreground"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { scrollTo, ready } = useLenis();
  const router = useRouter();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 16);
  });

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/")) return; // rute internal — navigasi browser default
    if (!ready) return;
    event.preventDefault();
    if (isHowFlowAnchor(href)) {
      switchHowFlow(href);
      void revealAndScroll("#how-it-works", (target) => scrollTo(target));
      setMenuOpen(false);
      return;
    }
    void revealAndScroll(href, (target) => scrollTo(target));
    setMenuOpen(false);
  };

  const navigate = (href: string) => {
    if (href.startsWith("/")) {
      setMenuOpen(false);
      void router.push(href);
      return;
    }
    if (!ready) return;
    if (isHowFlowAnchor(href)) {
      switchHowFlow(href);
      void revealAndScroll("#how-it-works", (target) => scrollTo(target));
      setMenuOpen(false);
      return;
    }
    void revealAndScroll(href, (target) => scrollTo(target));
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border bg-white/70 shadow-sm backdrop-blur-xl dark:bg-slate-950/70"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo onClick={(event) => handleAnchorClick(event, "#home")} className="shrink-0" />

          <nav aria-label="Navigasi utama" className="hidden items-center lg:flex">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item) =>
                item.mega ? (
                  <DesktopMegaItem key={item.href} item={item} onNavigate={handleAnchorClick} />
                ) : (
                  <DesktopNavItem key={item.href} item={item} onNavigate={handleAnchorClick} />
                )
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MagneticButton
              href="#contact"
              ariaLabel="Mulai Kampanye"
              onClick={(event) => {
                if (!ready) return;
                event.preventDefault();
                void revealAndScroll("#contact", (target) => scrollTo(target));
              }}
              className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:inline-flex"
            >
              Mulai Kampanye
            </MagneticButton>
            <button
              type="button"
              aria-label="Buka menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-surface lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={navigate} />
    </>
  );
}
