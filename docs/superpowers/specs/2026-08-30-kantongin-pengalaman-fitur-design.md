# Design — Pengalaman & Fitur: Halaman Harga, FAQ Lengkap, PWA Installable

- Tanggal: 2026-08-30
- Proyek: KantongIn (kantongin-beige.vercel.app)
- Branch: `feat/pengalaman-fitur` (dari `main` @ `ddce632`)
- Status: Disetujui user (§1–§4)

## Tujuan

Batch terakhir roadmap: meningkatkan pengalaman & fitur situs.

1. Halaman `/harga` — detail transparan (paket, estimator, cara kerja, garansi, FAQ).
2. Perluasan FAQ 7 → 11 berdasarkan fakta bisnis nyata (dikunci user):
   DP 50% + pelunasan 50%, garansi perbaikan 1 bulan, kontrak tertulis sederhana,
   aset 100% milik klien, layanan seluruh Indonesia via daring.
3. PWA installable: ikon PNG (192/512 + maskable), apple-touch-icon, manifest lengkap,
   `themeColor` — tanpa service worker (hanya installable, bukan offline).

Konten asli portofolio/testimoni/stats TIDAK termasuk batch ini (butuh materi user).

## Batasan & Konvensi

- Bahasa konten: Indonesia. Tanpa emoji di kode.
- Tanpa klaim harga baru — semua angka berasal dari `constants/pricing.ts`, estimator,
  atau fakta bisnis yang dikunci user.
- Tanpa library baru (ikon PNG via `ImageResponse` dari `next/og`, pola `og-image`).
- Node env: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1` sebelum npm/npx.
- Home page e2e harus tetap hijau setelah ekstraksi kartu paket.

## 1. FAQ — Perluasan 7 → 11

`constants/faqs.ts`: 4 FAQ baru + 1 update:

| # | Pertanyaan | Jawaban |
|---|---|---|
| 1 | Bagaimana alur pembayaran proyeknya? | Konsultasi gratis → penawaran & kontrak tertulis → DP 50% untuk memulai → review bertahap → pelunasan 50% saat website selesai |
| 2 | Apakah ada kontrak atau perjanjian tertulis? | Ya, kontrak tertulis sederhana: lingkup, biaya, timeline, jumlah revisi |
| 3 | Setelah selesai, website dan aset milik siapa? | 100% milik klien — kode, domain, hosting atas nama klien; bebas dipindahkan |
| 4 | Apakah melayani klien di luar kota? | Ya, seluruh Indonesia via daring; konsultasi & revisi lewat WhatsApp/video call |

- Update "Bagaimana dukungan setelah website diluncurkan?": pertegas garansi perbaikan
  **1 bulan** pasca luncur + paket Maintenance & Support opsional.
- Efek otomatis: `JsonLdFaq` (FAQPage schema) + home `FAQ.tsx` + `/layanan` (`details`
  count 7 → 11) ikut memuat; e2e & `faqs.test.ts` disesuaikan.

## 2. Halaman `/harga`

- `app/harga/page.tsx` (statis, `<main id="main">`, metadata + OG dinamis
  `buildOgImageUrl("Harga & Estimasi", siteConfig.tagline)`, BreadcrumbList
  JSON-LD `Beranda › Harga`).
- Blok:
  1. Intro: eyebrow "Harga", judul, paragraf transparansi, CTA konsultasi gratis (WA).
  2. `EstimatorCard` (reuse `components/sections/EstimatorCard.tsx`).
  3. 3 paket dari `constants/pricing.ts` — CTA per paket: WhatsApp prefilled
     `Halo KantongIn, saya ingin konsultasi paket <nama>.` (bukan anchor `#contact`).
  4. Transparansi & cara kerja: DP 50/50, kontrak tertulis, garansi 1 bulan, aset 100%
     milik klien, domain & hosting tidak termasuk (dibantu penyiapan), seluruh Indonesia.
  5. FAQ `components/sections/FAQ.tsx` + `JsonLdFaq`.
  6. Garansi & komitmen + CTA penutup WA.
- **Ekstraksi DRY**: `components/common/PricingCard.tsx` baru (server-friendly)
  dipakai home `Pricing.tsx` (smooth-scroll `#contact`) & `/harga` (link WA).
- Navigasi: item "Harga" di navbar + tautan footer; sitemap entry `0.8`, monthly.

## 3. PWA Installable + Polish

- `app/manifest-icon/route.tsx` (ImageResponse): PNG "K" (latar `#020617`, badge hijau),
  ukuran via query `?size=192|512`; selain itu → 400.
- `app/apple-icon.tsx` (ImageResponse 180×180): otomatis `/apple-icon.png`.
- `app/manifest.ts`: icons — SVG `any` + PNG 192/512 `any` dan `maskable`, `lang: "id"`.
- `app/layout.tsx`: export `viewport` `themeColor: "#22C55E"`.
- Tanpa service worker (installable, bukan offline).

## 4. Verifikasi & Testing

### 4.1 Unit

- `constants/faqs.test.ts`: 11 item, isi Q&A baru, output `JsonLdFaq` ikut.
- `constants/pricing.test.ts`: tak berubah (data sama).

### 4.2 e2e

- `e2e/harga.spec.ts` (baru): `/harga` — intro, 3 paket, EstimatorCard, FAQ,
  BreadcrumbList JSON-LD, CTA WA per paket.
- `e2e/seo-pages.spec.ts`: `/layanan` `details` count 7 → 11; `/manifest-icon?size=512`
  → 200 `image/png`; `?size=999` → 400; `/apple-icon.png` → 200 `image/png`.
- `e2e/home.spec.ts` tetap hijau (semantik kartu paket sama).

### 4.3 Gate

- `npm run lint` 0 error; `npm test` hijau; `npm run build` sukses
  (+`/harga`, `/apple-icon.png`, `/manifest-icon`); `npx playwright test` hijau.
- Deploy: curl — `/harga` 200, `/apple-icon.png` 200 png, `/manifest-icon?size=512`
  200 png, `/layanan` FAQ 11.

## 5. Strategi Pengiriman

Branch `feat/pengalaman-fitur` → 5 task:

1. Ekstrak `PricingCard` (DRY) — home tetap hijau.
2. Halaman `/harga` + navigasi (nav/footer) + sitemap + e2e harga.
3. FAQ 7→11 + `faqs.test.ts` + count e2e `/layanan`.
4. PWA: `manifest-icon` + `apple-icon` + manifest + viewport + e2e.
5. README + gate penuh + squash merge ke `main` + hapus branch + push + verifikasi produksi.

## File yang Terdampak

- `components/common/PricingCard.tsx` (baru), `components/sections/Pricing.tsx`
- `app/harga/page.tsx` (baru), `e2e/harga.spec.ts` (baru)
- `constants/faqs.ts`, `constants/faqs.test.ts`
- `app/manifest-icon/route.tsx` (baru), `app/apple-icon.tsx` (baru),
  `app/manifest.ts`, `app/layout.tsx`
- `constants/navigation.ts`, `components/layout/Footer.tsx`,
  `components/layout/Navbar.tsx`, `app/sitemap.ts`
- `e2e/seo-pages.spec.ts`, `e2e/home.spec.ts` (bila perlu)
- `README.md`