"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTA_REASSURANCE } from "@/constants/copy";
import { trackConversion } from "@/lib/analytics";
import { buildWhatsAppLink } from "@/lib/wa";
import {
  getRouteFromPathname,
  getScrollRatio,
  hasSeenPopup,
  markPopupSeen,
  shouldShowPopup,
} from "@/lib/conversion";
import { usePathname } from "next/navigation";

export function ConversionPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const route = getRouteFromPathname(pathname);
    if (route === "none" || hasSeenPopup(window.sessionStorage)) return;

    const openPopup = () => {
      markPopupSeen(window.sessionStorage);
      setOpen(true);
      trackConversion("popup_shown", { trigger: route });
    };

    const handleScroll = () => {
      const ratio = getScrollRatio(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight
      );
      if (
        shouldShowPopup({
          route,
          scrollRatio: ratio,
          mouseLeftViewport: false,
          seen: false,
        })
      ) {
        window.removeEventListener("scroll", handleScroll);
        openPopup();
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      if (event.relatedTarget !== null) return;
      if (
        shouldShowPopup({
          route,
          scrollRatio: 1,
          mouseLeftViewport: true,
          seen: false,
        })
      ) {
        document.removeEventListener("mouseleave", handleMouseLeave);
        openPopup();
      }
    };

    if (route === "blog") {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
    if (route === "layanan" || route === "harga") {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [pathname]);

  const closePopup = () => {
    if (open) {
      markPopupSeen(window.sessionStorage);
      trackConversion("popup_dismissed");
    }
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePopup();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onClick={closePopup}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Konsultasi gratis via WhatsApp"
        tabIndex={-1}
        className="w-full max-w-md rounded-3xl border border-border bg-background p-8 shadow-2xl outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageCircle className="size-6" aria-hidden="true" />
          </div>
          <button
            type="button"
            onClick={closePopup}
            aria-label="Tutup popup"
            className="rounded-full p-1.5 text-muted transition-colors hover:bg-border hover:text-foreground"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Bingung Mulai dari Mana?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Diskusikan kebutuhan website Anda langsung dengan kami — gratis,
          tanpa komitmen, dan jelas langkah pertamanya.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-6 w-full rounded-full"
          onClick={() => {
            markPopupSeen(window.sessionStorage);
            trackConversion("popup_cta_click");
          }}
        >
          <a
            href={buildWhatsAppLink(
              "Halo KantongIn, saya baru saja melihat website Anda dan ingin bertanya tentang pembuatan website."
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Konsultasi Gratis via WhatsApp
          </a>
        </Button>
        <p className="mt-4 text-center text-xs text-muted">{CTA_REASSURANCE}</p>
      </div>
    </div>
  );
}