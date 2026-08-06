import type { MouseEventHandler } from "react";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export function Logo({ className, onClick }: LogoProps) {
  return (
    <a
      href="#home"
      onClick={onClick}
      aria-label="KantongIn - Beranda"
      className={cn(
        "inline-flex select-none items-baseline text-xl font-extrabold tracking-tight text-foreground transition-opacity hover:opacity-90",
        className
      )}
    >
      Kantong
      <span className="text-primary">In</span>
      <span aria-hidden="true" className="text-primary">
        .
      </span>
    </a>
  );
}
