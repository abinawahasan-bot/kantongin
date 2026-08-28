# KantongIn — Landing Page

Landing page satu halaman untuk **KantongIn**, agency Digital Marketing & Creator
Collaboration di Indonesia. Menghubungkan brand, UMKM, startup, dan kreator lewat
affiliate marketing, endorsement, dan kolaborasi terkurasi.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) + shadcn/ui
- Framer Motion, GSAP, Lenis, Embla Carousel
- React Hook Form + Zod (skema form bersama di `lib/schemas/forms.ts`)
- Blog MDX via `next-mdx-remote` (RSC) + `gray-matter` (frontmatter fs-based)
- Rate limiting hibrida: Upstash Redis (opsional) dengan fallback in-memory
- [Resend](https://resend.com) untuk email (newsletter & form kontak)
- Vercel Analytics
- Vitest, Playwright, Lighthouse CI

## Menjalankan Secara Lokal

```bash
nvm use
npm install
cp .env.example .env.local   # isi RESEND_API_KEY
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
| `RESEND_API_KEY`       | API key Resend (wajib untuk form & newsletter)        |
| `RESEND_AUDIENCE_ID`   | Opsional. ID audience Resend untuk menyimpan kontak   |
| `RESEND_FROM_DOMAIN`   | Domain pengirim **milik Anda** yang sudah terverifikasi di Resend (wajib untuk kirim email). Jangan pakai `kantongin.com` |
| `UPSTASH_REDIS_REST_URL`   | Opsional. URL REST Upstash Redis untuk rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Opsional. Token REST Upstash Redis untuk rate limiting |

## Struktur Konten

- Halaman utama: `app/page.tsx` + `components/sections/*`
- Blog (MDX): cara menambah artikel tetap sama — drop file `.mdx` di
  `app/blog/_posts/` dengan blok frontmatter YAML (`title`, `description`,
  `date` berformat `YYYY-MM-DD` dengan tanda kutip, `author`, `tags` array).
  Posting otomatis muncul di daftar, detail SSG, sitemap, dan JSON-LD.
- Halaman legal: `/kebijakan-privasi`, `/syarat-ketentuan`,
  `/kebijakan-cookie` (template generik).
- Konfigurasi situs (nama, kontak, sosial): `constants/site.ts`

## Deploy

Repo ini dirancang untuk di-deploy ke **Vercel**. Deployment aktif saat ini tersedia
di `https://kantongin-beige.vercel.app`. (Catatan: domain `kantongin.com` bukan
milik kami dan bukan bagian dari project ini.)

1. Push ke GitHub (repo private).
2. Import proyek di Vercel; set env `RESEND_API_KEY` (+ `RESEND_AUDIENCE_ID`).
3. Vercel Analytics aktif otomatis setelah import.

CI berisi lint, tes unit, build, E2E (Playwright), dan audit Lighthouse yang
berjalan di setiap push/PR.

### Status Deploy

- Produksi: https://kantongin-beige.vercel.app (alias project Vercel
  `kantongin` di akun `abinawahasan`).
- `kantongin.com` **bukan milik kami** — jangan dipakai sebagai domain project ini.
  Jika ingin URL brand sendiri, daftarkan domain baru dan hubungkan ke Vercel.
