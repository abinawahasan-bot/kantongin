# KantongIn — Landing Page

Landing page satu halaman untuk **KantongIn**, jasa pembuatan website profesional
di Indonesia. Membantu UMKM, startup, dan brand tampil online lewat landing page,
company profile, toko online/e-commerce, hingga web app — desain responsif, cepat,
dan SEO-ready.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) + shadcn/ui
- Framer Motion, GSAP, Lenis, Embla Carousel
- Zod (skema validasi form bersama di `lib/schemas/forms.ts`)
- Blog MDX via `next-mdx-remote` (RSC) + `gray-matter` (frontmatter fs-based)
- Rate limiting hibrida: Upstash Redis (opsional) dengan fallback in-memory
- Jalur lead utama via WhatsApp: wizard estimasi harga (`#contact`) dan
  kalkulator di halaman `/layanan` membuka `wa.me` dengan pesan prefilled
  berisi rincian kebutuhan, estimasi awal, dan data kontak. Backend email
  (Resend) masih tersedia dan dormant sampai ada domain sendiri — beralih
  otomatis saat `RESEND_*` terisi.
- Email kontak bisnis aktif: `abinawahasan@gmail.com` ditampilkan (mailto) di
  wizard `#contact`, footer, halaman legal, dan JSON-LD. Jalur kirim email
  (Resend) tetap dormant sampai `RESEND_*` terisi.
- Estimator harga: model katalog & komputasi murni di `lib/estimator.ts`;
  UI bersama `components/common/PriceEstimator.tsx` dipakai wizard beranda
  (`components/sections/EstimateWizard.tsx`) dan kalkulator `/layanan`
  (`components/sections/EstimatorCard.tsx`). Pilihan bisa dibawa lintas
  halaman lewat query `?estimasi=`. Semua nilai bersifat indikatif
  ("mulai dari"), harga final disepakati saat konsultasi scope.
- Vercel Analytics
- Vitest, Playwright, Lighthouse CI

## Menjalankan Secara Lokal

```bash
nvm use
npm install
cp .env.example .env.local   # opsional: isi bila beralih ke jalur email Resend
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Script

| Perintah        | Fungsi                                    |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Server pengembangan (Turbopack)           |
| `npm run build` | Build produksi                            |
| `npm start`     | Menjalankan build produksi                |
| `npm run lint`  | ESLint                                    |
| `npm test`      | Tes unit (Vitest)                         |
| `npm run test:e2e` | Tes end-to-end (Playwright)            |
| `npm run analyze` | Analisis ukuran bundle produksi        |
| `npm run lighthouse` | Audit Lighthouse CI                  |

## Variabel Lingkungan

| Variabel               | Keterangan                                            |
| ---------------------- | ----------------------------------------------------- |
| `RESEND_API_KEY`       | Opsional. API key Resend — hanya untuk beralih ke jalur email; kosong = form kontak mengarah ke WhatsApp |
| `RESEND_AUDIENCE_ID`   | Opsional. ID audience Resend untuk menyimpan kontak   |
| `RESEND_FROM_DOMAIN`   | Opsional. Domain pengirim **milik Anda** yang sudah terverifikasi di Resend — hanya untuk beralih ke jalur email; jangan pakai `kantongin.com` |
| `UPSTASH_REDIS_REST_URL`   | Opsional. URL REST Upstash Redis untuk rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Opsional. Token REST Upstash Redis untuk rate limiting |

## Struktur Konten

- Halaman utama: `app/page.tsx` + `components/sections/*`
- Halaman statis SEO: `/layanan` (detail 6 layanan, proses, FAQ, CTA WhatsApp) di
  `app/layanan/page.tsx`; `/tentang-kami` (nilai, statistik, partner, testimoni,
  CTA) di `app/tentang-kami/page.tsx`.
- Konten terpusat (layanan, langkah, nilai, paket harga, FAQ, testimoni,
  portofolio, statistik): `constants/` — ubah copy di sana, bukan di komponen.
- Blog (MDX): cara menambah artikel tetap sama — drop file `.mdx` di
  `app/blog/_posts/` dengan blok frontmatter YAML (`title`, `description`,
  `date` berformat `YYYY-MM-DD` dengan tanda kutip, `author`, `category` Wajib,
  `tags` array). Posting otomatis muncul di daftar, halaman kategori
  (`/blog/kategori/<slug>`), artikel terkait (otomatis dari kategori & tag via
  `app/blog/related.ts`), detail SSG, sitemap, dan JSON-LD.
- Kartu artikel blog dipakai bersama lewat `app/blog/PostCard.tsx`.
- OG image dinamis per halaman: `app/og-image/route.tsx` (query `title` &
  opsional `subtitle`), dibangun lewat `buildOgImageUrl()` dari `lib/og.ts`.
- Halaman legal: `/kebijakan-privasi`, `/syarat-ketentuan`,
  `/kebijakan-cookie` (template generik).
- Konfigurasi situs (nama, kontak, sosial): `constants/site.ts`

## Deploy

Repo ini dirancang untuk di-deploy ke **Vercel**. Deployment aktif saat ini tersedia
di `https://kantongin-beige.vercel.app`. (Catatan: domain `kantongin.com` bukan
milik kami dan bukan bagian dari project ini.)

1. Push ke GitHub (repo private).
2. Import proyek di Vercel; set env `RESEND_API_KEY` (+ `RESEND_AUDIENCE_ID`)
   bila beralih ke jalur email.
3. Vercel Analytics aktif otomatis setelah import.

CI berisi lint, tes unit, build, E2E (Playwright), dan audit Lighthouse yang
berjalan di setiap push/PR.

### Status Deploy

- Produksi: https://kantongin-beige.vercel.app (alias project Vercel
  `kantongin` di akun `abinawahasan`).
- `kantongin.com` **bukan milik kami** — jangan dipakai sebagai domain project ini.
  Jika ingin URL brand sendiri, daftarkan domain baru dan hubungkan ke Vercel.
