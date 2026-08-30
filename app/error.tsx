"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("KantongIn error boundary:", error);
  }, [error]);

  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Terjadi kendala
      </p>
      <h1 className="mt-2 max-w-xl text-3xl font-bold text-foreground sm:text-4xl">
        Ada yang tidak beres
      </h1>
      <p className="mt-4 max-w-md text-muted">
        Silakan coba lagi, atau kembali ke beranda dan lanjutkan menjelajah.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()}>Coba lagi</Button>
        <Button asChild variant="outline">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </main>
  );
}