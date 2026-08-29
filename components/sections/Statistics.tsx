import { Counter } from "@/components/common/Counter";
import { GlowCard } from "@/components/common/GlowCard";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { stats } from "@/constants/stats";

const FEATURED = stats[4];
const REST = stats.slice(0, 4);

export function Statistics() {
  return (
    <section id="statistics" className="glow-section py-20 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="KantongIn dalam Angka"
          title="Hasil Nyata, Website Terukur"
          description="Angka yang terus bertumbuh dari website yang kami rancang, luncurkan, dan rawat untuk UMKM, startup, dan brand."
        />

        <Reveal delay={0.05} className="mt-12">
          <GlowCard className="rounded-2xl">
            <div className="flex flex-col gap-6 px-8 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Klien Merekomendasikan
                </p>
                <p className="mt-3 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                  <Counter
                    to={FEATURED.value}
                    suffix={FEATURED.suffix}
                    decimals={FEATURED.decimals}
                    className="text-gradient"
                  />
                </p>
              </div>
              <p className="max-w-sm text-base leading-relaxed text-muted">
                Prosentase klien yang puas dan merekomendasikan layanan kami —
                bukti bahwa website yang kami bangun benar-benar membantu bisnis
                mereka bertumbuh.
              </p>
            </div>
          </GlowCard>
        </Reveal>

        <dl className="mt-6 grid grid-cols-2 divide-border border-t border-border md:grid-cols-4 md:divide-x">
          {REST.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={0.08 * (index + 1)}
              className="border-b border-border px-6 py-8 md:border-b-0"
            >
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="mt-2 text-4xl font-bold tracking-tight text-foreground lg:text-[2.75rem]">
                <Counter to={stat.value} suffix={stat.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
