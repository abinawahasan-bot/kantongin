# Desain Pivot: KantongIn → Jasa Pembuatan Website

**Tanggal:** 2026-08-28
**Status:** Disetujui (design review)
**Lingkup:** Pivot total konten dari agency Digital Marketing & Creator
Collaboration menjadi jasa pembuatan website, dengan **struktur design yang sudah
dibuat dipertahankan** (komponen, layout, animasi, design system).

## Konteks

Landing page KantongIn saat ini menjual affiliate marketing, endorsement, dan
kolaborasi kreator. Bisnis dipivot total menjadi jasa pembuatan website. Brand
tetap bernama **KantongIn** — hanya arah layanan dan seluruh copy yang berganti.
Seluruh teks tersentralisasi di `constants/` dan copy komponen seksi, sehingga
perubahan ini bersifat content-swap tanpa menyentuh komponen UI, animasi, atau
konfigurasi styling.

## Keputusan yang Disetujui

- **Arah:** Pivot total jadi jasa website (konten agency kreator dihapus semua).
- **Brand:** Tetap "KantongIn"; tagline & description baru.
- **Layanan (Services):** Landing Page, Company Profile, E-commerce/Toko Online,
  Web App/Dashboard, Maintenance & Support (flagship: E-commerce).
- **Target pasar:** UMKM & lokal, Startup & SMB, Brand & korporat, Individu &
  kreator.
- **Model harga:** Hybrid — sekali bayar per project (3 kartu) + kartu Custom,
  tanpa periode bulanan.
- **Portofolio:** Placeholder fiktif yang masuk akal; struktur duotone + dialog
  detail dipertahankan; reuse file image lama.
- **Blog:** Isi baru bertema website/tips digital UMKM (artikel lama diganti).
- **Kontak:** Form email (Resend) + WhatsApp float dipertahankan. Email bisnis &
  `RESEND_FROM_DOMAIN` tetap kosong sampai punya domain sendiri.

## Pemetaan Perubahan

### 1. Brand & metadata — `constants/site.ts`, `app/layout.tsx`

- Nama: tetap "KantongIn".
- Tagline baru: "Jasa Pembuatan Website Profesional".
- `description`: fokus jasa pembuatan website (landing page, company profile,
  e-commerce, web app) untuk UMKM, startup, dan brand.
- `keywords` di `app/layout.tsx`: landing page, jasa pembuatan website, toko
  online, company profile, web app, SEO website, UMKM go online.
- `url` (deployment Vercel) dan `socials` (Instagram/TikTok/WhatsApp) tetap;
  `email` tetap kosong.

### 2. Hero — `components/sections/Hero.tsx` + `components/sections/hero/DashboardMockup.tsx`

- H1 (`AnimatedText`): "Website Profesional yang Mendatangkan Pelanggan"
  (highlight: "Mendatangkan Pelanggan").
- Subtitle: jasa pembuatan website — responsif, cepat, SEO-ready, sesuai anggaran.
- CTA: "Konsultasi Gratis" → `#contact`; link sekunder tetap "Lihat cara kerjanya"
  → `#how-it-works`.
- Social proof (`SOCIAL_PROOF` dari stats): otomatis mengikuti `constants/stats.ts`.
- `DashboardMockup` → mockup **browser window** bertajuk "kantongin • studio":
  - header browser (traffic light + tab) tetap;
  - panel "Proyek Aktif": daftar project website dengan status (On Progress /
    Selesai / Maintenance);
  - panel "Performa Website": skor PageSpeed/SEO dengan bar;
  - chip mengambang: "98% Klien Puas" (kiri atas) & "100+ Website Selesai"
    (kanan bawah) — disesuaikan dengan stats.
- Struktur visual (blur glow, tilt 3D, partikel, blob) tidak berubah.

### 3. TrustedBy — `constants/partners.ts`

Delapan nama placeholder brand klien (mis. RumahKreasi, KopiKita, SembakoID,
Klinik Sehat, NusaProperti, dll — menggantikan 8 nama mitra lama). Tanpa logo
baru — teks marquee tetap.

### 4. Statistics — `constants/stats.ts`

5 item baru (struktur `Stat` tetap):
- 120+ Website Selesai
- 45+ Brand & UMKM
- 4.9 Rating Klien (decimals: 1)
- 2+ Tahun Pengalaman
- 98% Klien Merekomendasikan

### 5. Services — `components/sections/Services.tsx` + `constants/services.ts`

- Bento: flagship **E-commerce / Toko Online** (span full) + 4 kartu third
  (**Landing Page**, **Company Profile**, **Web App / Dashboard**,
  **Maintenance & Support**) + Custom CTA card (span full). Total sama dengan
  kapasitas Bento sekarang.
- Icon map `Services.tsx` ditambah: `shoppingCart`, `layoutTemplate`,
  `building2`, `monitorSmartphone`, `wrench` (lucide-react).
- `SectionHeading`: eyebrow "Layanan", title "Semua Jenis Website yang Anda
  Butuhkan", description tentang kebutuhan tiap jenis bisnis.
- Custom CTA card: copy dipertahankan (konsultasi gratis untuk kebutuhan custom).

### 6. WhyChooseUs — `constants/values.ts`

4 nilai (struktur + key icon tetap `badgeCheck`/`barChart`/`rocket`/`trendingUp`):
- Design Modern & Responsif — badge "Siap Mobile"
- Fast & SEO-Ready — badge "PageSpeed 95+"
- Proses Transparan & Tepat Waktu — badge "Response < 24 Jam"
- Support & Maintenance — badge "Garansi Perbaikan"

### 7. HowItWorks — `constants/steps.ts` (+ heading `HowItWorks.tsx`)

Dua tab (id `brand`/`creator` **tetap** agar `lib/howTabs.ts` & hash tidak
berubah; yang diganti hanya label & steps):
- Tab "Website Baru": 01 Konsultasi & Kebutuhan → 02 Desain & Mockup →
  03 Development & Konten → 04 Deploy & Launch.
- Tab "Maintenance & Support": 01 Pengecekan Berkala → 02 Update Konten →
  03 Keamanan & Backup → 04 Laporan & Permintaan Baru.
- `SectionHeading`: title "Proses Pengerjaan yang Jelas & Terukur".

### 8. Portfolio — `constants/portfolio.ts`

- Kategori: `E-commerce` | `Company Profile` | `Landing Page` | `Web App`.
- 6 project placeholders fiktif: RumahKreasi (E-commerce fashion), KopiKita
  Online (E-commerce F&B), SembakoID (E-commerce grocery), Klinik Sehat (Company
  Profile), NusaProperti (Landing Page), FinanceHub (Web App).
- `result` + `metrics` placeholder (mis. "+2x Penjualan Online", "PageSpeed 98",
  "60% Lead Meningkat").
- Foto: reuse 6 file image `/portfolio/*.jpg` yang sudah ada sebagai placeholder;
  `gradient` per project disesuaikan.
- Struktur kartu duotone, chip hasil, filter, dan dialog detail tidak berubah.

### 9. Testimonials — `constants/testimonials.ts`

5 quote placeholder klien fiktif (Founder UMKM, Owner Toko Online, CMO Startup,
Kepala Operasional, Founder Jasa) — struktur `quote/name/role/company/rating/result`
tetap.

### 10. Pricing — `constants/pricing.ts`

Hybrid, sekali bayar, tanpa `period`:
1. **Landing Page — Rp 2,5 jt** (sekali): 1–3 halaman, desain custom, responsif,
   form kontak, basic SEO, gratis revisi.
2. **Company Profile — Rp 4,9 jt** (sekali, **highlight "Paling Populer"**):
   hingga 8 halaman, blog/sitemap, optimasi SEO, WhatsApp integrasi, daftar &
   pelatihan admin.
3. **Custom / Web App — Custom** (Hubungi Kami): web app, dashboard, integrasi
   sistem, e-commerce skala besar.

Chip bawah: "Tanpa biaya tersembunyi", "Gratis konsultasi", "Gratis revisi",
"Bantuan domain & hosting". Catatan kaki tetap "Butuh skala lebih besar?".

### 11. FAQ — `constants/faqs.ts`

7 pertanyaan baru (sinkron ke JSON-LD `JsonLdFaq` otomatis):
1. Berapa lama pengerjaan website? (Landing 1–2 minggu, Profile 2–3 minggu,
   E-commerce 3–6 minggu).
2. Apakah harga sudah termasuk domain & hosting? (Belum; kami bantu setup).
3. Bisakah saya minta revisi? (Gratis revisi dalam tahapan desain).
4. Teknologi apa yang dipakai? (Next.js/React modern, cepat & SEO-friendly).
5. Apakah website ramah HP? (Responsif di semua perangkat).
6. Bagaimana pembayarannya? (DP sesuai tahapan; sisa lunas saat serah terima).
7. Apa yang terjadi setelah website selesai? (Garansi perbaikan + opsi
   maintenance).

### 12. Contact — `components/sections/ContactSection.tsx` + `lib/schemas/forms.ts`

- Tambah field **"Jenis Layanan"** (select: Landing Page, Company Profile,
  E-commerce/Toko Online, Web App/Dashboard, Maintenance, Lainnya) — validasi Zod
  ikut diperbarui; API contact (Resend) menambahkan layanan ke pesan/subject.
- Label/placeholder disesuaikan (nama, email/WhatsApp, layanan, pesan).
- WhatsApp float & alur kirim tetap.

### 13. Blog — `app/blog/_posts/*.mdx`

Ganti artikel contoh (frontmatter tanggal berformat `YYYY-MM-DD` bertanda kutip):
1. "Pentingnya Website untuk UMKM di Era Digital"
2. "Landing Page vs Toko Online: Pilih yang Mana?"
3. "Cara Memilih Jasa Pembuatan Website yang Tepat"

### 14. Lain-lain

- CTA section (`CTASection.tsx`) & Footer: hanya copy.
- Navbar/mobile menu: label menu tetap; tidak perlu ubah.
- `README.md`: update deskripsi & tech-stack narrative sesuai pivot (aturan docs).
- Metadata/JSON-LD site (`JsonLd` di layout) mengikuti deskripsi baru.

## File yang Disentuh

- `constants/`: `site.ts`, `services.ts`, `steps.ts`, `values.ts`, `partners.ts`,
  `stats.ts`, `testimonials.ts`, `portfolio.ts`, `pricing.ts`, `faqs.ts`.
- Komponen: `Hero.tsx`, `hero/DashboardMockup.tsx`, `Services.tsx` (icon map),
  `HowItWorks.tsx` (heading), `ContactSection.tsx`, `CTASection.tsx`,
  `Footer.tsx`.
- `lib/schemas/forms.ts` (+ API contact bila perlu).
- `app/layout.tsx` (keywords), `app/blog/_posts/*.mdx`.
- Test: `components/sections/*.test.tsx` yang assert teks lama, e2e Playwright.
- Dokumentasi: `README.md`.

## Hal yang TIDAK Diubah

Komponen UI (`components/ui`), komponen common (GlowCard, BentoGrid, Reveal,
SectionHeading, dll), animasi (GSAP/Framer/Lenis), styling (Tailwind/globals),
config (`next.config`, `playwright`, `vitest`), struktur route, API shape
(contact/newsletter), dan `lib/howTabs.ts`.

## Verifikasi

- `npm run lint`
- `npm test` — test seksi di-update ke konten baru
- `npm run build`
- `npm run test:e2e` — e2e di-update jika assert teks lama
- Preview manual di `http://localhost:3000` (dev server aktif) + konfirmasi di
  Brave.
- Lighthouse tidak diwajibkan untuk pivot konten (tidak ada perubahan struktural),
  tapi build/E2E wajib hijau.

## Catatan

- Email bisnis & `RESEND_FROM_DOMAIN` tetap kosong sampai ada domain sendiri
  (sudah tercatat di README & `constants/site.ts`).
- Angka stats/testimonial/portofolio bersifat placeholder dan bisa diganti saat
  data nyata tersedia.