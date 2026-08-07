"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Briefcase,
  Camera,
  Check,
  MessageCircle,
  Music,
  Play,
  Send,
  type LucideIcon,
} from "lucide-react";
import type { MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Logo } from "@/components/common/Logo";
import { MagneticButton } from "@/components/common/MagneticButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { navItems } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";
import { useLenis } from "@/lib/lenis";

const newsletterSchema = z.object({
  email: z.string().email("Masukkan email yang valid"),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

const serviceLinks = [
  "Affiliate Marketing",
  "Open Promotion",
  "Endorsement / KOL",
  "Brand Collaboration",
  "Social Media Management",
  "Digital Campaign Strategy",
  "Content Production",
];

const resourceLinks = [
  { label: "FAQ", href: "#faq" },
  { label: "Cara Kerja", href: "#how-it-works" },
  { label: "Harga", href: "#pricing" },
  { label: "Blog", href: "#faq" },
];

const legalLinks = [
  { label: "Kebijakan Privasi", href: "#" },
  { label: "Syarat & Ketentuan", href: "#" },
  { label: "Kebijakan Cookie", href: "#" },
];

const socialIcons: Record<string, LucideIcon> = {
  instagram: Camera,
  tiktok: Music,
  linkedin: Briefcase,
  youtube: Play,
  whatsapp: MessageCircle,
};

function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    mode: "onBlur",
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="text-sm font-semibold text-foreground">Dapatkan tips terbaru</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Tips pemasaran digital dan update kampanye, langsung ke inbox Anda.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          placeholder="Email Anda"
          aria-label="Alamat email untuk newsletter"
          aria-invalid={errors.email ? true : undefined}
          {...register("email")}
          className="h-11 rounded-full border-border bg-surface"
        />
        <MagneticButton type="submit" ariaLabel="Berlangganan newsletter" strength={8}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full rounded-full sm:w-auto"
          >
            {isSubmitting ? (
              <span className="gap-2">Mengirim...</span>
            ) : (
              <span className="gap-2">
                Berlangganan
                <Send className="size-4" aria-hidden="true" />
              </span>
            )}
          </Button>
        </MagneticButton>
      </div>
      {errors.email ? (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {errors.email.message}
        </p>
      ) : null}
    </form>
  );
}

export function Footer() {
  const { scrollTo, ready } = useLenis();

  const handleAnchor = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
    if (!document.querySelector(target) || !ready) return;
    event.preventDefault();
    scrollTo(target);
  };

  const socials = Object.entries(siteConfig.socials).filter(
    ([, href]) => Boolean(href) && href !== "#"
  );

  return (
    <footer id="contact" className="scroll-mt-28 border-t border-border bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {siteConfig.description}
            </p>
            <ul className="mt-6 flex flex-wrap items-center gap-2">
              {socials.map(([name, href]) => {
                const Icon = socialIcons[name.toLowerCase()];
                if (!Icon) return null;
                return (
                  <li key={name}>
                    <a
                      href={href}
                      aria-label={`KantongIn di ${name}`}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Navigasi
            </h3>
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
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Layanan
            </h3>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((label) => (
                <li key={label}>
                  <a
                    href="#services"
                    onClick={(event) => handleAnchor(event, "#services")}
                    className="text-sm text-muted transition-colors duration-200 hover:text-primary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <NewsletterForm />
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  Sumber
                </h3>
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
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  Legal
                </h3>
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
