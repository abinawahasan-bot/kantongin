import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/wa";

const WA_NOT_FOUND_MESSAGE =
  "Halo KantongIn, saya menemukan halaman yang tidak ditemukan di situs Anda.";

export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center"
    >
      <Link
        href="/"
        aria-label="KantongIn - Beranda"
        className="inline-flex select-none items-baseline text-xl font-extrabold tracking-tight text-foreground transition-opacity hover:opacity-90"
      >
        Kantong
        <span className="text-primary">In</span>
        <span aria-hidden="true" className="text-primary">
          .
        </span>
      </Link>
      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        404
      </p>
      <h1 className="mt-2 max-w-xl text-3xl font-bold text-foreground sm:text-4xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-4 max-w-md text-muted">
        Halaman yang kamu cari mungkin telah dipindahkan atau tidak pernah ada.
        Kembali ke beranda atau tanyakan langsung lewat WhatsApp.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
        <Button asChild variant="outline">
          <a
            href={buildWhatsAppLink(WA_NOT_FOUND_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Konsultasi via WhatsApp
          </a>
        </Button>
      </div>
    </main>
  );
}