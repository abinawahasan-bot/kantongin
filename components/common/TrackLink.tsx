"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackConversion, type ConversionEvent } from "@/lib/analytics";

type TrackLinkProps = {
  href: string;
  event: ConversionEvent;
  payload?: Record<string, string | number | boolean | null>;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">;

/** Tautan yang memicu event konversi saat diklik; dipakai dari server component. */
export function TrackLink({ href, event, payload, children, ...rest }: TrackLinkProps) {
  return (
    <a
      href={href}
      onClick={() => trackConversion(event, payload)}
      {...rest}
    >
      {children}
    </a>
  );
}