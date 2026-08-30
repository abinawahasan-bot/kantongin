import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { DataIcon } from "@/components/common/DataIcon";
import { GlowCard } from "@/components/common/GlowCard";
import { JsonLdData, JsonLdFaq, buildBreadcrumbList, buildItemList } from "@/components/common/JsonLd";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { EstimatorCard } from "@/components/sections/EstimatorCard";
import { Button } from "@/components/ui/button";
import { faqs } from "@/constants/faqs";
import { siteConfig } from "@/constants/site";
import { services } from "@/constants/services";
import { flows } from "@/constants/steps";
import { buildOgImageUrl } from "@/lib/og";
import { buildWhatsAppLink } from "@/lib/wa";

const WA_CHAT_MESSAGE = "Halo KantongIn, saya ingin konsultasi pembuatan website.";

export const metadata: Metadata = {
  title: "Layanan",
  description:
    "Layanan pembuatan website KantongIn: landing page, company profile, toko online, web app, maintenance & support, dan konsultasi website.",
  openGraph: {
    title: "Layanan Pembuatan Website",
    description:
      "Layanan pembuatan website KantongIn: landing page, company profile, toko online, web app, maintenance & support, dan konsultasi website.",
    url: `${siteConfig.url}/layanan`,
    siteName: siteConfig.name,
    locale: "id_ID",
    images: [
      {
        url: buildOgImageUrl("Layanan Pembuatan Website", siteConfig.tagline),
        width: 1200,
        height: 630,
        alt: "Layanan Pembuatan Website | KantongIn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Layanan Pembuatan Website",
    description:
      "Layanan pembuatan website KantongIn: landing page, company profile, toko online, web app, maintenance & support, dan konsultasi website.",
    images: [buildOgImageUrl("Layanan Pembuatan Website", siteConfig.tagline)],
  },
};

const guaranteePoints = [
  "Gratis revisi pada tahap desain & pengembangan",
  "Estimasi waktu pengerjaan realistis, disepakati di awal",
  "Garansi perbaikan setelah website diluncurkan",
  "Pelatihan singkat agar Anda bisa mengelola website sendiri",
];

export default function LayananPage() {
  const processSteps = flows[0].steps;

  return (
    <main id="main" tabIndex={-1}>
      <JsonLdFaq />
      <JsonLdData
        data={buildBreadcrumbList([
          { name: "Beranda", url: "/" },
          { name: "Layanan" },
        ])}
      />
      <JsonLdData
        data={buildItemList(
          services.map((service, index) => ({
            name: service.title,
            url: `/layanan#layanan-${index + 1}`,
          }))
        )}
      />

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28">
        <div className="flex max-w-3xl flex-col gap-4">
          <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            Layanan
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Semua Jenis Website yang Anda Butuhkan
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Dari landing page hingga toko online dan web app — satu mitra untuk
            kebutuhan digital bisnis Anda, dikerjakan dari nol hingga meluncur.
            Semua paket dirancang responsif, cepat, dan SEO-ready.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full" variant="primary">
              <a
                href={buildWhatsAppLink(WA_CHAT_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Konsultasi Gratis
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/tentang-kami">
                Tentang Kami
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-2">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.04} className="h-full" id={`layanan-${index + 1}`}>
              <GlowCard className="h-full">
                <div className="flex h-full flex-col gap-5 p-7">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                      <DataIcon name={service.icon} className="size-6" />
                    </span>
                    <span aria-hidden="true" className="text-xs font-bold tracking-[0.2em] text-primary/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      {service.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted">
                      {service.description}
                    </p>
                  </div>
                  {service.points ? (
                    <ul className="space-y-2">
                      {service.points.map((point) => (
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
                  ) : null}
                  <a
                    href={buildWhatsAppLink(
                      `Halo KantongIn, saya ingin konsultasi ${service.title}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex w-fit items-center gap-1.5 pt-2 text-sm font-semibold text-primary"
                  >
                    Konsultasi layanan ini
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>

        <div className="mt-20">
          <SectionHeading
            align="left"
            eyebrow="Cara Kerja"
            title="Proses yang Jelas dari Awal"
            description="Langkah demi langkah yang transparan — Anda selalu tahu status proyeknya."
          />
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.06} className="h-full">
                <GlowCard className="h-full">
                  <div className="flex h-full flex-col gap-3 p-6">
                    <span className="text-xs font-bold tracking-[0.2em] text-primary/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </ol>
        </div>

        <EstimatorCard />

        <div className="mt-20">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Pertanyaan yang Sering Diajukan"
            description="Jawaban atas hal-hal yang paling sering ditanyakan sebelum memulai proyek."
          />
          <div className="mt-12 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-border bg-surface/50 p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown
                    className="size-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-20 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/[0.07] via-transparent to-accent/[0.07] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Garansi &amp; Komitmen Kami
          </h2>
          <ul className="mx-auto mt-6 grid max-w-3xl gap-3 text-left sm:grid-cols-2">
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
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted">
            Tertarik mengerjakan proyek bersama kami? Konsultasi pertama gratis
            tanpa komitmen.
          </p>
          <Button asChild size="lg" className="mt-6 rounded-full">
            <a
              href={buildWhatsAppLink(WA_CHAT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Konsultasi via WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}