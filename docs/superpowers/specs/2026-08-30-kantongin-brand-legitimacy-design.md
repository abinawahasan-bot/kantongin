# KantongIn — Legitimasi & Brand (Batch 1) Design

**Tanggal:** 30 Agustus 2026
**Status:** Disetujui user (30 Agustus 2026)

## Ringkasan

Batch perbaikan fondasi profesionalisme situs KantongIn. Domain tetap
menggunakan URL Vercel sementara; email bisnis yang ditampilkan adalah
`abinawahasan@gmail.com`; jalur kirim email (Resend) tetap dormant sampai
ada domain terverifikasi milik sendiri. Portfolio/partner/testimoni tetap
ilustratif dengan disclaimer yang sudah ada.

## Keputusan yang Dikunci

| Keputusan | Nilai |
|---|---|
| Email ditampilkan | `abinawahasan@gmail.com` |
| Jalur kirim email | Tetap dormant (`/api/contact`, `/api/newsletter` tetap 503; butuh `RESEND_API_KEY` + domain terverifikasi) |
| Domain | Tetap `https://kantongin-beige.vercel.app` (placeholder Vercel) |
| Konten ilustratif | Dipertahankan dengan disclaimer yang sudah ada |
| Rename anchor internal | Dilakukan sekarang: `#affiliate`/`#creators` → `#website-baru`/`#maintenance` |
| Halaman error | Tambah `app/not-found.tsx` + `app/error.tsx` |

## Perubahan

### 1. Konfigurasi Email

- `constants/site.ts`: `email` diisi `abinawahasan@gmail.com`; komentar
  disesuaikan (hapus "dikosongkan sampai ada domain", pertahankan catatan
  domain Vercel placeholder).
- Efek otomatis dari `siteConfig.email` yang terisi:
  - Kartu Email di `components/sections/EstimateWizard.tsx:201` muncul.
  - `email` masuk JSON-LD Organization (`components/common/JsonLd.tsx:10`).
  - Halaman legal menampilkan mailto (`app/kebijakan-*/page.tsx`,
    `app/syarat-ketentuan/page.tsx`).
- `constants/site.test.ts:14`: `expect(siteConfig.email).toBe("")` →
  `"abinawahasan@gmail.com"`.
- API route tidak berubah: tetap 503 saat `RESEND_API_KEY`/`RESEND_FROM_DOMAIN`
  kosong (pendekatan A).

### 2. Footer Email

- `components/layout/Footer.tsx`: tambah tautan email (mailto + ikon Mail
  dari lucide-react) di kolom brand (bawah socials), jalur kontak kedua
  selain WhatsApp.

### 3. Bersihkan Sisa Branding Lama

- `app/opengraph-image.tsx`:
  - `alt` (baris 5) → `"KantongIn — ${siteConfig.tagline}"`.
  - Subjudul (baris 52) → `siteConfig.tagline` ("Jasa Pembuatan Website
    Profesional"). Import `siteConfig`.
- `app/syarat-ketentuan/page.tsx` (kritis):
  - Metadata description (baris 7-8): tidak menyebut "mitra kolaborasi".
  - Paragraf "Layanan Kami" (baris 23-26): ganti deskripsi bisnis lama
    (affiliate, endorsement, kreator, social media, kampanye, produksi
    konten) dengan jasa website: landing page, company profile, toko
    online/e-commerce, web app, maintenance & optimasi, konsultasi.
- `app/kebijakan-privasi/page.tsx`:
  - "kebutuhan kampanye" → "kebutuhan website/usaha".
  - "kerja sama kampanye" → "kerja sama layanan".
  - `[Nama Entitas]` dibiarkan (entitas legal belum diinformasikan).
- Ketiga halaman legal: hapus blockquote "template awal" dan perbarui
  `updated` → "30 Agustus 2026".

### 4. Halaman Error

- `app/not-found.tsx` (server component): Logo, heading 404, pesan
  "Halaman tidak ditemukan", CTA "Kembali ke Beranda" (`/`) dan
  "Konsultasi via WhatsApp" (outline, `lib/wa.ts`). Gaya konsisten
  (`bg-background`, `text-foreground`, `text-muted`, tombol primary).
- `app/error.tsx` (`"use client"`): pesan umum, tombol "Coba lagi"
  (`reset()`), tautan kembali ke beranda; `console.error` di `useEffect`
  tanpa menampilkan detail error ke pengguna.

### 5. Rename Anchor Internal (Cara Kerja)

Label UI tidak berubah ("Website Baru", "Maintenance & Support").

| Lama | Baru | File |
|---|---|---|
| `HowFlow = "brand" \| "creator"` | `HowFlow = "new-site" \| "maintenance"` | `lib/howTabs.ts` |
| `HOW_FLOW_ANCHORS = ["#affiliate", "#creators"]` | `["#website-baru", "#maintenance"]` | `lib/howTabs.ts` |
| `FLOW_BY_ANCHOR` | petakan anchor baru → flow baru | `lib/howTabs.ts` |
| `id: "brand"`, `anchorId: "affiliate"` | `id: "new-site"`, `anchorId: "website-baru"` | `constants/steps.ts` |
| `id: "creator"`, `anchorId: "creators"` | `id: "maintenance"`, `anchorId: "maintenance"` | `constants/steps.ts` |
| default `"brand"` | default `"new-site"` | `components/sections/HowItWorks.tsx:103,108` |
| `LAZY_SECTION_ANCHORS` berisi `#affiliate`,`#creators` | `#website-baru`, `#maintenance` | `lib/reveal-section.ts:3-14` |
| `hashes={["#how-it-works", "#affiliate", "#creators"]}` | `["#how-it-works", "#website-baru", "#maintenance"]` | `components/sections/LazySections.tsx:49` |
| test `["brand", "creator"]`, `["affiliate", "creators"]` | `["new-site", "maintenance"]`, `["website-baru", "maintenance"]` | `constants/steps.test.ts` |
| e2e id `"affiliate"` | `"website-baru"` | `e2e/home.spec.ts:40` |

Konsekuensi: URL hash `#affiliate`/`#creators` lama berhenti berfungsi —
diterima karena tidak ada tautan publik yang menunjuk ke sana.

### 6. Ops & README

- `.env.local` (tidak di-commit): hapus baris `RESEND_FROM_DOMAIN=kantongin.com`;
  jangan sentuh `VERCEL_OIDC_TOKEN`; pastikan `.env.local` tidak pernah masuk git.
- `README.md`: perbarui bagian label/kontekstual — email kontak aktif via
  mailto (`abinawahasan@gmail.com`), jalur kirim email Resend tetap dormant
  sampai `RESEND_*` terisi.

### 7. Pengujian

- Unit: `constants/site.test.ts` (email), `constants/steps.test.ts` (rename).
- E2e: tambah test 404 (navigasi ke `/halaman-tidak-ada` → konten "Halaman
  tidak ditemukan" + CTA Beranda); perbarui `e2e/home.spec.ts:40` (rename).
- `error.tsx` tidak di-e2e (verifikasi manual via build).
- Gate: lint, `npm test`, `npm run build`, `npx playwright test`.

## Keluar dari Cakupan

- Rename file/simbol lain bertema lama selain yang tercantum (mis. nama
  `steps` lainnya) — tidak ditemukan di kode view.
- Nama file/blog lama di `docs/` sejarah — dokumen historis, tidak diubah.
- Konten asli portfolio/testimoni — batch terpisah.
- Domain sendiri & aktivasi Resend — butuh kepemilikan domain.