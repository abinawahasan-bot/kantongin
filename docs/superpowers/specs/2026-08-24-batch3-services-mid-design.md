# Desain Batch 3: Services + WhyChooseUs + HowItWorks

**Tanggal:** 2026-08-24
**Status:** Disetujui (dialog brainstorming)
**Induk:** `2026-08-24-kantongin-composition-upgrade-design.md`

## Konteks

Ketiga seksi tengah ini sudah matang (WhyChooseUs punya connector SVG animasi,
HowItWorks punya tab beranimasi + timeline GSAP scrubbed). Upgrade bersifat bedah
presisi, bukan rombakan.

## Services — transformasi Bento

Masalah: 7 kartu seragam 3 kolom + 1 CTA = ritme datar; layanan unggulan tidak menonjol.

Struktur baru (`BentoGrid`/`BentoItem` dari Fase 0):

- **Affiliate Marketing** = kartu flagship horizontal `span="full"`: icon besar di kiri,
  poin menjadi chip horizontal, label indeks `01`.
- 6 layanan lain = kartu standar `span="third"` dengan indeks `02`–`07`.
- **CustomCtaCard** = `span="full"`.
- Heading baru: eyebrow "Layanan", judul "Semua yang Brand Butuhkan untuk Tumbuh",
  deskripsi dipertajam.
- Kontrak komponen tetap: anchor `#contact`, icons map, `ServiceCardProps`.

## WhyChooseUs — aksen editorial ringan

- `SectionHeading` → `align="left"` + `size="display"` (konsisten dengan Statistics).
- Deskripsi seksi diringkas. Zigzag rows, Connector SVG, ghost numbers dipertahankan.

## HowItWorks — polish tipis

- Struktur/tabs/timeline tidak diubah. Hanya deskripsi heading dipertajam agar paralel
  dengan gaya copy baru.

## Verifikasi

- Id section tetap (`#services`, `#why`, `#how-it-works`) — E2E tanpa perubahan.
- Unit test baru: Services (7 layanan, heading baru, struktur bento, CTA card),
  WhyChooseUs (heading display kiri).
- Gerbang: lint + test + build + E2E; Lighthouse median 3 sampel vs baseline main.
- Branch `feat/services-mid`, squash merge ke `main`.
