"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { navItems } from "@/constants/navigation";
import { useLenis } from "@/lib/lenis";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

export function MobileMenu({ open, onClose, onNavigate }: MobileMenuProps) {
  const { stop, start } = useLenis();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Lenis drives wheel scrolling on the window, so body overflow alone is not
    // enough on desktop; stopping Lenis covers wheel while the overflow lock
    // handles native touch scrolling. Documented limitation: any other feature
    // relying on Lenis while the menu is open would be paused too.
    if (open) {
      stop();
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      start();
      document.body.style.overflow = "";
    }
    return () => {
      start();
      document.body.style.overflow = "";
    };
  }, [open, stop, start]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-background lg:hidden"
          variants={overlayVariants}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              Kantong
              <span className="text-primary">In</span>
              <span className="text-primary">.</span>
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Tutup menu"
              onClick={onClose}
              className="inline-flex size-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-surface"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Navigasi utama" className="flex flex-1 flex-col px-6 py-6">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <motion.li key={item.href} variants={itemVariants}>
                  <a
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate(item.href);
                    }}
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-xl font-semibold text-foreground transition-colors hover:bg-surface"
                  >
                    {item.label}
                    <ArrowUpRight className="size-5 text-muted" aria-hidden="true" />
                  </a>
                  {item.mega ? (
                    <ul className="mb-2 mt-1 space-y-0.5 border-l border-border pl-4">
                      {item.mega.flatMap((column) => column.items).map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            onClick={(event) => {
                              event.preventDefault();
                              onNavigate(link.href);
                            }}
                            className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="shrink-0 px-6 pb-10">
            <motion.a
              variants={itemVariants}
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("#contact");
              }}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
            >
              Mulai Kampanye
              <ArrowUpRight className="size-5" aria-hidden="true" />
            </motion.a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
