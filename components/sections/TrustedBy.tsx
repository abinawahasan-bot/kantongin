import { Marquee } from "@/components/common/Marquee";
import { partners } from "@/constants/partners";
import { cn } from "@/lib/utils";

const STYLES = [
  "font-black uppercase tracking-tight",
  "font-light lowercase tracking-[0.3em]",
  "font-extrabold italic tracking-tight",
  "font-semibold uppercase tracking-[0.2em]",
  "font-bold tracking-tight",
  "font-black uppercase tracking-widest",
  "font-light uppercase tracking-[0.25em]",
  "font-medium lowercase tracking-wide",
] as const;

const DOT_INDICES = new Set([0, 3, 5]);

type PartnerWordmarkProps = {
  name: string;
  index: number;
};

function PartnerWordmark({ name, index }: PartnerWordmarkProps) {
  const style = STYLES[index % STYLES.length];
  const withDot = DOT_INDICES.has(index % STYLES.length);

  return (
    <span className="flex shrink-0 items-center gap-3">
      {withDot ? (
        <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
      ) : null}
      <span
        className={cn(
          "whitespace-nowrap text-2xl text-foreground/40 transition-colors duration-300 group-hover:text-foreground/80",
          style
        )}
      >
        {name}
      </span>
    </span>
  );
}

export function TrustedBy() {
  return (
    <section id="trusted" className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium tracking-wide text-muted">
          Dipercaya oleh brand &amp; UMKM ternama
        </p>
      </div>
      <div className="mt-12 space-y-6">
        <Marquee duration={36}>
          {partners.map((name, index) => (
            <PartnerWordmark key={name} name={name} index={index} />
          ))}
        </Marquee>
        <Marquee reverse duration={44}>
          {partners.map((name, index) => (
            <PartnerWordmark key={name} name={name} index={index} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
