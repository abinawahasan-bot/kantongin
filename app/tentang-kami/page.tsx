import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { Counter } from "@/components/common/Counter";
import { DataIcon } from "@/components/common/DataIcon";
import { GlowCard } from "@/components/common/GlowCard";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { partners } from "@/constants/partners";
import { siteConfig } from "@/constants/site";
import { stats } from "@/constants/stats";
import { testimonials } from "@/constants/testimonials";
import { values } from "@/constants/values";
import { buildOgImageUrl } from "@/lib/og";
import { buildWhatsAppLink } from "@/lib/wa";

const WA_CHAT_MESSAGE = "Halo KantongIn, saya ingin konsultasi pembuatan website.";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "KantongIn adalah tim jasa pembuatan website untuk UMKM, startup, dan brand — landing page, company profile, toko online, hingga web app.",
  openGraph: {
    title: "Tentang KantongIn",
    description:
      "KantongIn adalah tim jasa pembuatan website untuk UMKM, startup, dan brand — landing page, company profile, toko online, hingga web app.",
    url: `${siteConfig.url}/tentang-kami`,
    siteName: siteConfig.name,
    locale: "id_ID",
    images: [
      {
        url: buildOgImageUrl("Tentang KantongIn", siteConfig.tagline),
        width: 1200,
        height: 630,
        alt: "Tentang KantongIn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang KantongIn",
    description:
      "KantongIn adalah tim jasa pembuatan website untuk UMKM, startup, dan brand — landing page, company profile, toko online, hingga web app.",
    images: [buildOgImageUrl("Tentang KantongIn", siteConfig.tagline)],
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `Tentang ${siteConfig.name}`,
  url: `${siteConfig.url}/tentang-kami`,
  description: siteConfig.description,
  mainEntity: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
};

export default function TentangKamiPage() {
  return (
    <main id="main" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28">
        <div className="flex max-w-3xl flex-col gap-4">
          <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            Tentang Kami
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Tentang KantongIn
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            KantongIn membantu UMKM, startup, dan brand tampil profesional lewat
            jasa pembuatan website — landing page, company profile, toko online,
            hingga web app. Prinsip kami sederhana: website yang bagus bukan yang
            paling rumit, tapi yang benar-benar mendatangkan kepercayaan dan
            penjualan.
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
              <Link href="/layanan">
                Lihat Layanan
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading
            align="left"
            eyebrow="Nilai Kami"
            title="Cara Kami Bekerja"
            description="Empat nilai yang kami pegang di setiap proyek, dari konsultasi pertama hingga dukungan setelah website meluncur."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06} className="h-full">
                <GlowCard className="h-full">
                  <div className="flex h-full flex-col gap-4 p-6">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex w-fit rounded-xl bg-primary/10 p-3 text-primary">
                        <DataIcon name={value.icon} className="size-6" />
                      </span>
                      <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
                        {value.badge}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {value.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted">
                      {value.description}
                    </p>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading
            align="left"
            eyebrow="KantongIn dalam Angka"
            title="Hasil Nyata, Website Terukur"
            description="Angka yang terus bertumbuh dari website yang kami rancang, luncurkan, dan rawat."
          />
          <dl className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.05}>
                <GlowCard className="h-full">
                  <div className="flex h-full flex-col gap-2 p-5">
                    <dt className="text-sm text-muted-foreground">
                      {stat.label}
                    </dt>
                    <dd className="text-3xl font-bold tracking-tight text-foreground">
                      <Counter
                        to={stat.value}
                        suffix={stat.suffix}
                        decimals={stat.decimals}
                      />
                    </dd>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </dl>
        </div>

        <div className="mt-20">
          <SectionHeading
            align="left"
            eyebrow="Dipercaya"
            title="Brand yang Pernah Bekerja Sama"
            description="Sebagian nama yang menjadi bagian dari perjalanan kami. Contoh partner di halaman ini bersifat ilustratif."
          />
          <ul className="mt-12 flex flex-wrap gap-3">
            {partners.map((partner) => (
              <li key={partner}>
                <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted-foreground">
                  {partner}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20">
          <SectionHeading
            align="left"
            eyebrow="Testimoni"
            title="Kata Mereka tentang KantongIn"
            description="Beberapa contoh testimoni klien. Testimoni di halaman ini bersifat ilustratif."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 0.06} className="h-full">
                <GlowCard className="h-full">
                  <div className="flex h-full flex-col gap-4 p-6">
                    <Quote className="size-5 text-primary/60" aria-hidden="true" />
                    <p className="line-clamp-5 text-sm leading-relaxed text-muted-foreground">
                      {testimonial.quote}
                    </p>
                    <div className="mt-auto pt-2">
                      <p className="text-sm font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted">
                        {testimonial.role} — {testimonial.company}
                      </p>
                    </div>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-20 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/[0.07] via-transparent to-accent/[0.07] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Siap mulai proyek website Anda?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted">
            Ceritakan kebutuhan bisnis Anda — konsultasi pertama gratis tanpa
            komitmen. Tim kami siap membantu dari nol hingga website meluncur.
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