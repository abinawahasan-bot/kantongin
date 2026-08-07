# KantongIn — Landing Page

Landing page satu halaman untuk **KantongIn**, agency Digital Marketing & Creator
Collaboration di Indonesia. Menghubungkan brand, UMKM, startup, dan kreator lewat
affiliate marketing, endorsement, dan kolaborasi terkurasi.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) + shadcn/ui
- Framer Motion, GSAP, Lenis, Embla Carousel
- React Hook Form + Zod
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
| `RESEND_FROM_DOMAIN`   | Domain pengirim (default `kantongin.com`)             |

## Struktur Konten

- Halaman utama: `app/page.tsx` + `components/sections/*`
- Blog (MDX): tambahkan file di `app/blog/_posts/*.mdx` dengan blok `frontmatter`
  (`title`, `description`, `date`, `author`, `tags`). Posting otomatis muncul di
  daftar, detail SSG, sitemap, dan JSON-LD.
- Konfigurasi situs (nama, kontak, sosial): `constants/site.ts`

## Deploy

Repo ini dirancang untuk di-deploy ke **Vercel** dengan domain `kantongin.com`.

1. Push ke GitHub (repo private).
2. Import proyek di Vercel; set env `RESEND_API_KEY` (+ `RESEND_AUDIENCE_ID`).
3. Vercel Analytics aktif otomatis setelah import.

CI berisi lint, tes unit, build, E2E (Playwright), dan audit Lighthouse yang
berjalan di setiap push/PR.
