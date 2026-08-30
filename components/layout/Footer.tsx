"use client";

import { ArrowRight, Check, Mail } from "lucide-react";
import type { MouseEvent } from "react";
import { Logo } from "@/components/common/Logo";
import { SocialIcon } from "@/components/common/SocialIcon";
import { navItems } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";
import { isHowFlowAnchor, switchHowFlow } from "@/lib/howTabs";
import { useLenis } from "@/lib/lenis";
import { revealAndScroll } from "@/lib/reveal-section";
import { buildWhatsAppLink } from "@/lib/wa";

const WA_CHAT_MESSAGE = "Halo KantongIn, saya ingin konsultasi pembuatan website.";

const serviceLinks = [
  { label: "Semua Layanan", href: "/layanan" },
  { label: "E-commerce / Toko Online", href: "#services" },
  { label: "Website Landing Page", href: "#services" },
  { label: "Website Company Profile", href: "#services" },
  { label: "Web App / Dashboard", href: "#services" },
  { label: "Maintenance & Support", href: "#services" },
  { label: "Konsultasi Website", href: "#services" },
];

const resourceLinks = [
  { label: "FAQ", href: "#faq" },
  { label: "Cara Kerja", href: "#how-it-works" },
  { label: "Harga", href: "/harga" },
  { label: "Blog", href: "/blog" },
];

const legalLinks = [
  { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
  { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
  { label: "Kebijakan Cookie", href: "/kebijakan-cookie" },
];

const followLinks = [
  { label: "Instagram", href: siteConfig.socials.instagram, icon: "instagram" as const },
  { label: "TikTok", href: siteConfig.socials.tiktok, icon: "tiktok" as const },
  {
    label: "WhatsApp",
    href: buildWhatsAppLink(WA_CHAT_MESSAGE),
    icon: "whatsapp" as const,
  },
];

const socialIcons = ["instagram", "tiktok", "whatsapp"] as const;

export function Footer() {
  const { scrollTo, ready } = useLenis();

  const handleAnchor = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
    if (target.startsWith("/")) return; // rute internal — navigasi browser default
    if (!ready) return;
    event.preventDefault();
    if (isHowFlowAnchor(target)) {
      switchHowFlow(target);
      void revealAndScroll("#how-it-works", (t) => scrollTo(t));
      return;
    }
    void revealAndScroll(target, (t) => scrollTo(t));
  };

  const socials = Object.entries(siteConfig.socials);

  return (
    <footer className="scroll-mt-28 border-t border-border bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {siteConfig.description}
            </p>
            <ul className="mt-6 flex flex-wrap items-center gap-2">
              {socials.map(([name, href]) => {
                const iconName = name.toLowerCase() as (typeof socialIcons)[number];
                if (!socialIcons.includes(iconName)) return null;
                return (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`KantongIn di ${name}`}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary"
                    >
                      <SocialIcon name={iconName} className="size-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
            >
              <Mail className="size-4" aria-hidden="true" />
              {siteConfig.email}
            </a>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Navigasi
            </h2>
            <ul className="mt-4 space-y-2.5">
              {navItems
                .filter((item) => !item.mega)
                .map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={(event) => handleAnchor(event, item.href)}
                      className="inline-flex items-center gap-1 text-sm text-muted transition-colors duration-200 hover:text-primary"
                    >
                      {item.label}
                      {item.href === "#contact" ? (
                        <ArrowRight className="size-3" aria-hidden="true" />
                      ) : null}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Layanan
            </h2>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(event) => handleAnchor(event, link.href)}
                    className="text-sm text-muted transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Ikuti Kami
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Tips membangun website dan update layanan — ikuti akun resmi
              KantongIn.
            </p>
            <ul className="mt-4 space-y-2.5">
              {followLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-primary"
                  >
                    <SocialIcon name={link.icon} className="size-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  Sumber
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {resourceLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(event) => handleAnchor(event, link.href)}
                        className="text-sm text-muted transition-colors duration-200 hover:text-primary"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  Legal
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {legalLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted transition-colors duration-200 hover:text-primary"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Hak cipta dilindungi.
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            Dibuat dengan
            <span aria-hidden="true" className="text-primary">
              <Check className="size-3.5" />
            </span>
            di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}