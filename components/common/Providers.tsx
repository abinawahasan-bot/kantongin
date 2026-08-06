"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { LenisProvider } from "@/lib/lenis";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <LenisProvider>{children}</LenisProvider>
    </ThemeProvider>
  );
}
