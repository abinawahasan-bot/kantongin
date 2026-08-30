# Plan — SEO & Konten: Artikel Baru, JSON-LD Breadcrumb/ItemList, RSS Feed

- Desain: `docs/superpowers/specs/2026-08-30-kantongin-seo-konten-design.md`
- Branch: `feat/seo-konten` dari `main @ 842cc85`
- Gate: lint 0 error, unit hijau, build sukses, e2e hijau.

## Task 1 — JSON-LD builders + unit

**Test dulu (`components/common/JsonLd.test.ts`):**

- `buildBreadcrumbList([{name,url},...])`:
  - menempatkan URL absolut (`siteConfig.url` + path) pada item non-terakhir,
  - item terakhir TANPA properti `item`,
  - posisi `itemListElement` 1-based berurutan,
  - `@type: "BreadcrumbList"`.
- `buildItemList(...)`: sama, `@type: "ItemList"`.

**Implementasi (`components/common/JsonLd.tsx`):**

- `buildBreadcrumbList` / `buildItemList` murni; bawaan kosong → array item kosong (bukan throw).
- Komponen `JsonLdData({ data })` → `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />` (sekali render, tanpa `key`).

**Verifikasi:** `npx vitest run components/common/JsonLd.test.ts` hijau.
**Commit:** `feat(seo): builder JSON-LD BreadcrumbList & ItemList`

## Task 2 — Terapkan BreadcrumbList/ItemList di 4 halaman + e2e

**Implementasi:**

- `app/blog/[slug]/page.tsx`: inject `JsonLdData data={buildBreadcrumbList([...])}`
  `Blog → <Kategori> → <Judul>` (dua item pertama ber-link, terakhir tidak).
- `app/blog/kategori/[slug]/page.tsx`: `Blog → Kategori → <Nama>`.
- `app/blog/page.tsx`: `buildItemList(posts → {name: title, url: /blog/<slug>})`.
- `app/layanan/page.tsx`: BreadcrumbList `Beranda → Layanan` + ItemList 6 layanan
  (url `/layanan#<anchor>`; pastikan `id` section tiap layanan ada).

**e2e (`e2e/seo-pages.spec.ts` + `e2e/blog.spec.ts`):**

- `/blog` & `/layanan`: script `ItemList` ada.
- detail artikel (`/blog/berapa-biaya-bikin-website`) & `/layanan`: script `BreadcrumbList` ada.

**Verifikasi:** e2e file terkait hijau.
**Commit:** `feat(seo): pasang JSON-LD BreadcrumbList & ItemList di blog dan layanan`

## Task 3 — RSS feed

**Test dulu (`lib/feed.test.ts`):**

- `buildFeedXml()` berisi `<?xml` dan `<rss`, tiap slug posting muncul sebagai `<guid>`,
  item terbaru (tanggal terbesar) di urutan pertama,
  `&`/`<`/`>` di description ter-escape.

**Implementasi:**

- `lib/feed.ts`: `buildFeedXml()` — RSS 2.0; `pubDate` pakai `toUTCString()`;
  `description` dari frontmatter + escape `&<>` (dan `"`).
- `app/feed.xml/route.ts`: `export const runtime = "nodejs"; export const GET = () => new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })`.
- `app/layout.tsx`: `alternates: { types: { "application/rss+xml": "/feed.xml" } }`.

**e2e:** `e2e/seo-pages.spec.ts` — `/feed.xml` 200, `content-type` `application/rss+xml`,
memuat judul artikel terbaru.

**Verifikasi:** unit + e2e hijau; `curl -s localhost:3000/feed.xml | head` saat server dev.
**Commit:** `feat(seo): RSS feed /feed.xml`

## Task 4 — Artikel batch 1 (3 artikel)

Tulis MDX baru di `app/blog/_posts/` (format sama seperti existing, tanpa emoji,
700–1.000 kata, subtitle `##`, interlink + CTA WhatsApp prefilled di akhir):

1. `berapa-biaya-bikin-website.mdx` — kategori `Jasa Website`, tags `["Biaya", "Estimasi", "Jasa Website"]`,
   date `2026-08-14`. Konten konsisten dengan `lib/estimator.ts` (label + range harga ada).
2. `company-profile-vs-landing-page.mdx` — kategori `Jasa Website`,
   tags `["Company Profile", "Landing Page"]`, date `2026-08-15`.
3. `cara-membuat-toko-online-untuk-usaha-kecil.mdx` — kategori `E-commerce`,
   tags `["Toko Online", "E-commerce"]`, date `2026-08-16`.

**e2e:** `e2e/blog.spec.ts` loop slug baru — judul & deskripsi ter-render, breadcrumb ada,
halaman kategori masih rapi.

**Verifikasi:** `npm test` (posts 9, kategori 3) + e2e blog hijau.
**Commit:** `feat(blog): 3 artikel baru (biaya, company profile vs landing page, toko online)`

## Task 5 — Artikel batch 2 (3 artikel)

4. `kapan-bisnis-butuh-maintenance-website.mdx` — kategori `Jasa Website`,
   tags `["Maintenance", "Perawatan Website"]`, date `2026-08-17`.
5. `tanda-bisnis-siap-go-online.mdx` — kategori `UMKM & Digital`,
   tags `["UMKM", "Go Online"]`, date `2026-08-18`.
6. `jasa-pembuatan-website-yogyakarta.mdx` — kategori `Jasa Website`,
   tags `["Yogyakarta", "Jasa Website", "SEO Lokal"]`, date `2026-08-19`.
   TANPA klaim alamat/kantor; konteks pasar Jogja + kriteria memilih partner; CTA WA.

**Verifikasi:** unit — total posting 9, kategori tetap 3; e2e blog hijau (termasuk 2 slug baru Task 5).
**Commit:** `feat(blog): 3 artikel baru (maintenance, siap go online, jasa website jogja)`

## Task 6 — README, gate, integrasi

- `README.md`: update struktur (feed, builder JSON-LD) + daftar artikel (9).
- Gate penuh: `npm run lint`, `npm test`, `npm run build`, `npx playwright test`.
- Squash merge `feat/seo-konten` → `main`, hapus branch (`-D`), `git push origin main`.
- Verifikasi produksi (curl): `/feed.xml` 200; 6 slug artikel 200; `BreadcrumbList` di detail &
  `/layanan`; `ItemList` di `/blog` & `/layanan`.
- **Commit docs:** `docs(readme): struktur & daftar artikel` (sebagai commit terakhir branch).