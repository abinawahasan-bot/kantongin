# Plan — Pengalaman & Fitur: /harga, FAQ 7→11, PWA Installable

- Desain: `docs/superpowers/specs/2026-08-30-kantongin-pengalaman-fitur-design.md`
- Branch: `feat/pengalaman-fitur` dari `main @ ddce632`
- Gate: lint 0 error, unit hijau, build sukses, e2e hijau.

## Task 1 — Ekstrak `PricingCard` (DRY)

**Langkah:**
- `components/common/PricingCard.tsx` (baru): komponen server murni `PricingCard({ plan, index, ctaHref, ctaTarget })` —
  markup diambil dari kartu `Pricing.tsx` (Reveal + GlowCard + badge "Paling Populer" + harga + fitur + tombol),
  tombol CTA berupa `<a href={ctaHref}>` (bukan anchor handler).
- `components/sections/Pricing.tsx`: pakai `PricingCard` dengan `ctaHref="#contact"` yang tetap di-handle
  oleh `onClick` lenis (`revealAndScroll`) — semantik & teks sama, home e2e tetap hijau.

**Verifikasi:** `npm test` hijau; `npx playwright test e2e/home.spec.ts` hijau.
**Commit:** `refactor(pricing): ekstrak PricingCard untuk dipakai home &harga`

## Task 2 — Halaman `/harga`

**Implementasi:**
- `app/harga/page.tsx` (baru): statis; metadata + OG `buildOgImageUrl("Harga & Estimasi", siteConfig.tagline)`;
  `JsonLdData` BreadcrumbList `Beranda › Harga`; blok intro (CTA WA), `EstimatorCard`, 3 `PricingCard`
  dengan `buildWhatsAppLink("Halo KantongIn, saya ingin konsultasi paket <nama>.")`, panel "Transparansi
  & cara kerja" (5 poin dari fakta terkunci), `FAQ` + `JsonLdFaq`, panel garansi + CTA WA.
- `constants/navigation.ts`: tambah item "Harga" (`/harga`).
- `components/layout/Navbar.tsx` & `Footer.tsx`: sesuaikan agar item baru muncul (ikuti pola item lain).
- `app/sitemap.ts`: entry `/harga` priority 0.8, `monthly`.

**e2e (`e2e/harga.spec.ts` baru):** `/harga` — heading intro `Harga`; 3 nama paket terlihat
(`Landing Page`, `Company Profile`, `Custom / Web App`); `EstimatorCard` terlihat; FAQ heading;
BreadcrumbList JSON-LD; minimal satu link `wa.me`; `toHaveTitle(/Harga/)`.

**Verifikasi:** unit (pricing tak berubah) + e2e harga + e2e home.
**Commit:** `feat(harga): halaman /harga dengan estimasi, paket, dan FAQ`

## Task 3 — FAQ 7 → 11

**Implementasi (`constants/faqs.ts`):** tambah 4 FAQ (pembayaran DP 50/50, kontrak tertulis,
aset milik klien, layanan seluruh Indonesia) + update jawaban FAQ dukungan → garansi 1 bulan.

**Test (`constants/faqs.test.ts`):** jumlah 11; tiap Q&A pas; `JsonLdFaq` memuat 11 `Question`;
konten berisi kata kunci (pembayaran, kontrak, garansi).

**e2e (`e2e/seo-pages.spec.ts`):** `/layanan` `details` count 7 → 11.

**Verifikasi:** unit + e2e seo-pages.
**Commit:** `feat(faq): perluas FAQ 7→11 berdasarkan fakta bisnis nyata`

## Task 4 — PWA installable

**Implementasi:**
- `app/manifest-icon/route.tsx` (baru): `ImageResponse`, PNG "K" (latar `#020617`, lingkaran/badge hijau `#22C55E`)
  untuk `?size=192|512`; selain itu `new Response("Bad Request", { status: 400 })`.
- `app/apple-icon.tsx` (baru): `ImageResponse` 180×180 ikon sama (Next → `/apple-icon.png`).
- `app/manifest.ts`: icons = `{icon.svg, any, image/svg+xml, any}` + PNG `192x192` `any` +
  `512x512` `any` + `512x512` `maskable` (`/manifest-icon?size=...`); `lang: "id"`.
- `app/layout.tsx`: tambah `export const viewport: Viewport = { themeColor: "#22C55E" }`.

**e2e (`e2e/seo-pages.spec.ts`):** `/manifest-icon?size=512` → 200 `image/png`; `?size=999` → 400;
`/apple-icon.png` → 200 `image/png`.

**Verifikasi:** build sukses + e2e seo-pages.
**Commit:** `feat(pwa): ikon PNG 192/512 + apple-touch-icon + manifest & viewport`

## Task 5 — README, gate, integrasi

**Langkah:**
- `README.md`: struktur — `/harga`, ikon PWA (manifest-icon/apple-icon), FAQ 11.
- Gate penuh: `npm run lint`, `npm test`, `npm run build`, `npx playwright test`.
- Squash merge `feat/pengalaman-fitur` → `main`, hapus branch (`-D`), `git push origin main`.
- Verifikasi produksi (curl): `/harga` 200 + BreadcrumbList; `/apple-icon.png` 200 png;
  `/manifest-icon?size=512` 200 png; `/layanan` FAQ 11; home e2e green (sanity).
- **Commit:** `docs(readme): harga, FAQ, dan PWA` (commit terakhir branch).