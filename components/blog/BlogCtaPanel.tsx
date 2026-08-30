import { ArrowRight } from "lucide-react";
import { TrackLink } from "@/components/common/TrackLink";
import { Button } from "@/components/ui/button";
import { BLOG_CTA_MESSAGES, CTA_REASSURANCE } from "@/constants/copy";
import { buildWhatsAppLink } from "@/lib/wa";

type BlogCtaPanelProps = {
  /** Kategori blog untuk pesan prefilled; tanpa ini = pesan default (index blog). */
  category?: string;
};

export function BlogCtaPanel({ category }: BlogCtaPanelProps) {
  const message =
    (category && BLOG_CTA_MESSAGES[category]) || BLOG_CTA_MESSAGES.default;

  return (
    <section
      aria-label="Butuh bantuan menerapkan tips dari artikel ini?"
      className="mt-14 not-prose"
    >
      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/[0.07] via-transparent to-accent/[0.07] p-8 sm:p-12">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Mau Menerapkannya di Website Anda?
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Konsultasikan kebutuhan website Anda — diskusi awal gratis tanpa
          komitmen, dan setiap proyek didampingi kontrak tertulis.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="rounded-full">
            <TrackLink
              href={buildWhatsAppLink(message)}
              event="blog_cta_click"
              payload={category ? { category } : { section: "blog-index" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Konsultasi Gratis via WhatsApp
              <ArrowRight className="size-4" aria-hidden="true" />
            </TrackLink>
          </Button>
          <p className="text-sm text-muted">{CTA_REASSURANCE}</p>
        </div>
      </div>
    </section>
  );
}