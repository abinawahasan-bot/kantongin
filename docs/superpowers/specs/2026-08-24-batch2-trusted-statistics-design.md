# Desain Batch 2: TrustedBy + Statistics

**Tanggal:** 2026-08-24
**Status:** Disetujui (dialog brainstorming)
**Induk:** `2026-08-24-kantongin-composition-upgrade-design.md` (arah: Premium SaaS + aksen editorial)

## TrustedBy — dari teks polos ke chip premium

Masalah: wordmark teks polos terpotong kasar di tepi layar, tanpa anchor visual.

1. Wordmark menjadi pill chip berborder (`rounded-full border border-border bg-surface`),
   variasi tipografi eksisting dipertahankan sebagai karakter.
2. Utility `.marquee-fade` di `app/globals.css`: `mask-image` gradient
   (`transparent → black 12% → black 88% → transparent`) pada wrapper Marquee agar
   tepi memudar halus.
3. Label atas menjadi eyebrow bergaya SectionHeading: uppercase, tracking lebar,
   aksen garis primary.

## Statistics — dari tabel kotak ke editorial stat

Masalah: grid bordered terasa seperti spreadsheet, tanpa hierarki; 5 angka berbobot setara.

1. `SectionHeading` baru: eyebrow "KantongIn dalam Angka", judul "Hasil Nyata, Bukan Janji".
2. Featured stat: **Rp 2,5M+ Komisi Disalurkan** dalam `GlowCard`, angka display besar
   dengan `.text-gradient`, plus satu kalimat deskripsi.
3. Baris divider 4 statistik lain (350+, 120+, 850+, 60rb): angka besar `tabular-nums`,
   pemisah garis tipis antar kolom, tanpa kotak.
4. Background `.glow-section` di belakang area featured.

## Perbaikan a11y sekalian

`.marquee-track` tetap bergerak saat `prefers-reduced-motion` (pelanggaran WCAG 2.3.3).
Fix: `.marquee-track { animation: none }` di blok reduced-motion `app/globals.css`.

## Verifikasi

- Tanpa dependensi baru; id section & landmark tetap; heading semantics aman (h2 baru).
- E2E eksisting tidak menyentuh kedua seksi; unit test baru untuk Statistics.
- Gerbang: `npm run lint && npm test && npm run build && npm run test:e2e`;
  Lighthouse median 3 sampel vs baseline `main`.
- Branch `feat/trusted-statistics`, squash merge ke `main`.
