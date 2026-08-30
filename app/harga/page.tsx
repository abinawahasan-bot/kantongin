import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buildBreadcrumbList, JsonLdData, JsonLdFaq } from "@/components/common/JsonLd";
import { PricingCard } from "@/components/common/PricingCard";
import { TrackLink } from "@/components/common/TrackLink";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/components/sections/FAQ";
import { EstimatorCard } from "@/components/sections/EstimatorCard";
import { WA_CHAT_MESSAGE } from "@/constants/copy";
import { guaranteePoints, paymentFlow } from "@/constants/guarantees";
import { pricingPlans } from "@/constants/pricing";
import { siteConfig } from "@/constants/site";
import { buildOgImageUrl } from "@/lib/og";
import { buildWhatsAppLink } from "@/lib/wa";

export const metadata: Metadata = {
  title: "Harga",
  description:
    "Harga pembuatan website KantongIn: paket landing page, company profile, dan custom. Hitung estimasi sendiri, transparan, tanpa biaya tersembunyi.",
  openGraph: {
    title: "Harga & Estimasi",
    description:
      "Harga pembuatan website KantongIn: paket landing page, company profile, dan custom. Hitung estimasi sendiri, transparan, tanpa biaya tersembunyi.",
    url: `${siteConfig.url}/harga`,
    siteName: siteConfig.name,
    locale: "id_ID",
    images: [
      {
        url: buildOgImageUrl("Harga & Estimasi", siteConfig.tagline),
        width: 1200,
        height: 630,
        alt: "Harga & Estimasi | KantongIn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harga & Estimasi",
    description:
      "Harga pembuatan website KantongIn: paket landing page, company profile, dan custom. Hitung estimasi sendiri, transparan, tanpa biaya tersembunyi.",
    images: [buildOgImageUrl("Harga & Estimasi", siteConfig.tagline)],
  },
};

export default function HargaPage() {
  return (
    <main id="main" tabIndex={-1}>
      <JsonLdFaq />
      <JsonLdData
        data={buildBreadcrumbList([
          { name: "Beranda", url: "/" },
          { name: "Harga" },
        ])}
      />

      <section className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6 lg:px-8">
        <div className="flex max-w-3xl flex-col gap-4">
          <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            Harga
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Harga Transparan, Tanpa Kejutan
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Website dimulai dari ratusan ribu rupiah — sesuaikan dengan kebutuhan
            bisnis Anda. Hitung estimasi sendiri di bawah, dan konsultasikan scope
            untuk penawaran pasti yang tertulis dalam kontrak.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full" variant="primary">
              <TrackLink
                href={buildWhatsAppLink(WA_CHAT_MESSAGE)}
                event="cta_whatsapp_click"
                payload={{ section: "harga-intro" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Konsultasi Gratis
              </TrackLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="#estimasi">
                Lihat Estimasi
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <EstimatorCard />

      <section id="paket" className="relative scroll-mt-28 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Paket"
              title="Pilih Paket Sesuai Kebutuhan"
              description="Ketiga paket mencakup gratis revisi, seluruhnya bisa dikonsultasikan lebih dulu."
            />
          </Reveal>
          <div className="mt-12 grid max-w-5xl items-stretch gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={plan.name}
                plan={plan}
                index={index}
                ctaHref={buildWhatsAppLink(
                  `Halo KantongIn, saya ingin konsultasi paket ${plan.name}.`
                )}
                ctaTarget="_blank"
                trackEvent="cta_whatsapp_click"
                trackSection="harga-paket"
              />
            ))}
          </div>
          <Reveal delay={0.15}>
            <p className="mt-10 text-sm leading-relaxed text-muted">
              Biaya domain dan hosting tidak termasuk dalam paket — kami bantu
              penyiapannya dengan biaya yang transparan sejak awal.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="transparansi" className="relative scroll-mt-28 pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/[0.07] via-transparent to-accent/[0.07] p-8 sm:p-12">
            <SectionHeading
              align="left"
              eyebrow="Cara Kerja"
              title="Transparansi dari Awal sampai Selesai"
              description="Alur kerja yang jelas dan jujur — Anda tahu posisi proyek di setiap tahap."
            />
            <ol className="mt-10 grid gap-4 md:grid-cols-5">
              {paymentFlow.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-surface/50 p-4 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="shrink-0 text-xs font-bold tracking-[0.2em] text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {guaranteePoints.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FAQ />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/[0.07] via-transparent to-accent/[0.07] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Siap Menghitung Kebutuhan Anda?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
            Konsultasi pertama gratis tanpa komitmen. Dapatkan penawaran tertulis
            dan estimasi waktu yang realistis untuk proyek Anda.
          </p>
          <Button asChild size="lg" className="mt-6 rounded-full">
            <TrackLink
              href={buildWhatsAppLink(WA_CHAT_MESSAGE)}
              event="cta_whatsapp_click"
              payload={{ section: "harga-cta" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Konsultasi via WhatsApp
            </TrackLink>
          </Button>
        </div>
      </div>
    </main>
  );
}