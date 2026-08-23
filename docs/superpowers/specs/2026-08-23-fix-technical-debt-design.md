# Desain: Perbaikan Kelemahan Teknis KantongIn

Tanggal: 2026-08-23
Status: Disetujui oleh pengguna

## Konteks

Landing page KantongIn (Next.js 16, Turbopack, React 19, Tailwind v4) memiliki 6 kelemahan teknis hasil analisis: rate limiter in-memory tidak efektif di serverless, duplikasi skema Zod client/server, duplikasi logika glob MDX di sitemap, dead code, placeholder legal/sosial (`href="#"`), dan ketergantungan `import.meta.glob` (fitur Turbopack/Vite). Project disiapkan untuk dijual, sehingga kompleksitas setup pembeli menjadi pertimbangan.

## Keputusan Desain (disetujui)

1. **Ruang lingkup**: semua 6 kelemahan diperbaiki.
2. **Rate limiter**: hibrida — pakai Upstash Redis bila env tersedia, fallback ke in-memory bila tidak (buyer langsung jalan tanpa akun baru).
3. **Placeholder**: buat halaman Kebijakan Privasi, Syarat & Ketentuan, Kebijakan Cookie generik; hapus entri sosial LinkedIn/YouTube yang kosong.
4. **Blog**: ganti `import.meta.glob` dengan modul fs-based (`gray-matter` + `next-mdx-remote` RSC); satu sumber kebenaran untuk listing blog & sitemap.
5. **Git**: branch `fix/technical-debt` dari `main`, squash merge kembali setelah CI hijau.

## A. Rate Limiter Hibrida

Deps baru: `@upstash/redis`, `@upstash/rate-limiter`.

- `rateLimitByIp()` menjadi async; return `{ ok, retryAfter? }` semantiknya sama.
- Bila env `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` terisi → `Ratelimit.fixedWindow` berbasis Redis dengan prefix `kantongin:ratelimit`; instance di-cache per kombinasi `(limit, windowMs)`.
- Bila tidak → fallback implementasi in-memory Map yang ada.
- Kedua API route cukup menambahkan `await`.
- Test unit: jalur in-memory tetap + jalur Redis dengan mock.

## B. Skema Zod DRY

Modul baru `lib/schemas/forms.ts` mengekspor `contactSchema` dan `newsletterSchema` (+ tipe infer). Empat konsumen mengimpor dari sana: `ContactSection.tsx`, `Footer.tsx`, `api/contact/route.ts`, `api/newsletter/route.ts`. Pesan validasi Indonesia identik.

## C. Blog fs-Based + Sitemap DRY

Deps baru: `gray-matter`, `next-mdx-remote`. Deps dihapus: `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react` (@types/mdx dipertahankan untuk tipe).

- `app/blog/_posts.ts`: `fs.readdirSync` untuk slug + `gray-matter` untuk frontmatter → `posts` (sort desc) dan `getPost(slug)` yang mengembalikan `{ frontmatter, content }`; validasi slug whitelist (anti path-traversal).
- `[slug]/page.tsx`: render `<MDXRemote source={content} components={mdxComponents} />`.
- Map tipografi MDX pindah ke `lib/mdx-components.tsx` sebagai konstanta; hapus root `mdx-components.tsx`.
- `next.config.ts`: hapus pipeline MDX (`pageExtensions` default).
- `app/sitemap.ts`: impor `posts` dari `_posts.ts` — duplikasi hilang.
- Tetap SSG murni (`dynamicParams = false`); e2e blog harus tetap hijau.

## D. Hapus Dead Code

`styles/theme.css`, `lib/theme.ts`, `hooks/use-media-query.ts`, `components/ui/{card,skeleton,separator,avatar}.tsx` — terverifikasi nol impor.

## E. Halaman Legal + Sosial

- `siteConfig.socials`: entri `linkedin` & `youtube` dihapus (footer sudah memfilter `"#"`, UI tak berubah; e2e hanya assert instagram).
- Komponen bersama `components/layout/LegalPage.tsx` (layout + tipografi prose via arbitrary variants).
- Tiga halaman TSX statis: `/kebijakan-privasi`, `/syarat-ketentuan`, `/kebijakan-cookie` — template generik Bahasa Indonesia bergaya template, konsisten dengan disclosure penjualan.
- Footer legal links menunjuk route nyata (tanpa handler anchor); ketiga URL masuk sitemap (priority 0.3).
- E2E baru: klik link "Kebijakan Privasi" dari footer → heading h1 terlihat.

## F. Dokumentasi

README: baris env Upstash opsional, tech stack & struktur disesuaikan. Opsional lanjutan: sinkronkan `kantongin-sales-package/01-asset-inventory.md` setelah commit final (di luar scope repo).

## Verifikasi

`npm run lint && npm test && npm run build && npm run test:e2e && npm run lighthouse` — semua wajib lulus sebelum merge.

## Risiko

- `next-mdx-remote/rsc` harus menghasilkan markup ekuivalen pipeline @next/mdx — diverifikasi via e2e blog yang sudah ada.
- Cache instance limiter dalam modul: kombinasi `(limit, windowMs)` unik per pemanggil, aman.
