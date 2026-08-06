import { Counter } from "@/components/common/Counter";
import { Reveal } from "@/components/common/Reveal";
import { stats } from "@/constants/stats";

export function Statistics() {
  return (
    <section id="statistics" className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-border/50">
          <div className="grid grid-cols-2 gap-px md:grid-cols-3 lg:grid-cols-5">
            {stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 0.08}
                className="bg-background px-6 py-10 text-center lg:py-12"
              >
                <Counter
                  to={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl"
                />
                <p className="mt-3 text-sm text-muted-foreground">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
