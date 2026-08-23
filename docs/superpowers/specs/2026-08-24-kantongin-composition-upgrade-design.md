# Desain: Upgrade Komposisi Landing Page KantongIn

**Tanggal:** 2026-08-24
**Status:** Disetujui (dialog brainstorming)
**Arah visual:** Modern Premium SaaS + aksen editorial

## Konteks & Tujuan

Landing page KantongIn memiliki 12 seksi (`components/sections/`): Hero, TrustedBy,
Statistics, Services, WhyChooseUs, HowItWorks, Portfolio, Testimonials, Pricing,
CTASection, FAQ, ContactSection. Upgrade dilakukan bertahap dari atas ke bawah,
mencakup **visual/animasi** dan **copywriting**, tanpa dependensi baru dan tanpa
mengubah arsitektur yang sudah ada.

Prinsip:

- Evolusi dari gaya "clean premium" yang sudah ada (GlowCard, Particles, blob mesh),
  bukan rombak total.
- Audiens B2B Indonesia (brand, UMKM, startup) → trust & profesionalisme di atas
  eksperimentalisme.
- Semua copy user-facing tetap Bahasa Indonesia; sumber kebenaran tetap `constants/*.ts`.

## Alur Kerja

1. Merge `fix/technical-debt` → `main` (squash) sebagai basis bersih. ✅ selesai.
2. Setiap fase = branch `feat/*` baru dari `main`, commit konvensional bahasa
   Indonesia imperatif, squash merge kembali ke `main`.
3. Gerbang verifikasi tiap fase:
   `npm run lint && npm test && npm run build && npm run test:e2e && npm run lighthouse`
   — skor Lighthouse tidak boleh turun signifikan; semua animasi baru hormati
   `useReducedMotion` dan pointer non-fine.

## Fase 0 — Fondasi Desain (branch `feat/design-foundation`)

Primitif eksisting tidak mengubah API; hanya penambahan:

| Item | Bentuk | Konsumen nanti |
| --- | --- | --- |
| `components/common/BentoGrid.tsx` | Wrapper grid responsif dengan konfigurasi span per item (client component ringan, tanpa state) | Services, WhyChooseUs, Pricing |
| Utility `.text-gradient` & `.glow-section` di `app/globals.css` | Aksen editorial: gradient primary→accent untuk teks; background glow halus per-seksi | Hero, seksi lain |
| `SectionHeading` prop opsional `size="display"` | Tipografi besar clamp 3rem–5rem via Tailwind arbitrary | Seksi dengan aksen editorial |

Kriteria lulus: lint/test/build/E2E hijau tanpa perubahan perilaku UI (belum ada
konsumen baru), snapshot visual tidak berubah.

## Fase 1 — Pilot Hero (branch `feat/hero-upgrade`)

### Visual

- Floating KPI chips (tepat 2 kartu mini: "+214% ROI", "850+ Kreator") melayang
  di sekitar `DashboardMockup` dengan float loop lembut (Framer Motion), tersembunyi
  pada reduced-motion, tidak mengganggu hit-test (pointer-events-none).
- Frasa kunci H1 memakai `.text-gradient`.
- Tuning opacity mesh/blob/Particles agar kontras teks naik (baik untuk LCP/a11y).
- Trust chips diganti strip bukti sosial mini bersumber `constants/stats.ts`.
- Struktur section, anchor `#home/#services/#contact/#affiliate`, dan scroll cue dipertahankan.

### Copywriting (draft — final dikonfirmasi user sebelum implement)

- H1: "Tumbuhkan Penjualan Lewat Kolaborasi Kreator Terkurasi"
- Sub-H1: "Affiliate marketing & endorsement berbasis performa — bayar sesuai hasil,
  bukan janji. KantongIn hubungkan brand Anda dengan 850+ kreator siap kampanye."
- CTA primer: "Mulai Kampanye Gratis" · CTA sekunder: link-teks "Lihat cara kerjanya"

## Batch Berikutnya (spec terpisah setelah pilot disetujui)

`(TrustedBy, Statistics)` → `(Services, WhyChooseUs, HowItWorks)` →
`(Portfolio, Testimonials)` → `(Pricing, CTA, FAQ, Contact)`

Setiap batch mendapat spec + rencana implementasi sendiri, mengacu fondasi Fase 0.

## Batasan Teknis

- Tanpa dependensi baru.
- LCP Hero: mockup & KPI chip tidak boleh menunda render konten utama;
  animasi masuk via transform/opacity saja.
- Heading semantics (satu h1 per halaman) dan struktur landmark dipertahankan.
- E2E eksisting (`e2e/home.spec.ts`) wajib tetap hijau; jika selector terdampak
  perubahan copy, update test pada commit yang sama.
