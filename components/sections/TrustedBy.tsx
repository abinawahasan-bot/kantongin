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
    <span className="flex shrink-0 items-center rounded-full border border-border bg-surface px-5 py-2.5 transition-colors duration-300 group-hover:border-primary/40">
      {withDot ? (
        <span aria-hidden="true" className="mr-3 size-2 rounded-full bg-primary" />
      ) : null}
      <span
        className={cn(
          "whitespace-nowrap text-xl text-muted transition-colors duration-300 group-hover:text-foreground",
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
        <div className="flex items-center justify-center gap-4">
          <span aria-hidden="true" className="h-px w-10 bg-primary" />
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted">
            Dipercaya oleh brand &amp; UMKM ternama
          </p>
          <span aria-hidden="true" className="h-px w-10 bg-primary" />
        </div>
      </div>
      <div className="mt-12 space-y-6">
        <Marquee className="marquee-fade" duration={36}>
          {partners.map((name, index) => (
            <PartnerWordmark key={name} name={name} index={index} />
          ))}
        </Marquee>
        <Marquee className="marquee-fade" reverse duration={44}>
          {partners.map((name, index) => (
            <PartnerWordmark key={name} name={name} index={index} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
