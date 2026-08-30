# Design — SEO & Konten: Artikel Baru, JSON-LD Breadcrumb/ItemList, RSS Feed

- Tanggal: 2026-08-30
- Proyek: KantongIn (kantongin-beige.vercel.app)
- Branch: `feat/seo-konten` (dari `main` @ `842cc85`)
- Status: Disetujui user (modal dialog, §1–§4)

## Tujuan

Menutup sisa gap "SEO & konten" yang belum tercakup batch `seo-content` sebelumnya
(kategori, related posts, halaman `/layanan` & `/tentang-kami`, OG dinamis sudah live):

1. Enam artikel blog baru (intensi pembeli + SEO lokal), gaya MDX sama seperti posting existing.
2. JSON-LD `BreadcrumbList` (detail artikel, kategori, `/layanan`) dan `ItemList` (`/blog`, `/layanan`).
3. RSS feed `/feed.xml` (tanpa library baru).

Catatan: analitik **sudah ada** (Vercel Web Analytics di `app/layout.tsx`) — tidak ada
perubahan analitik di batch ini.

## Batasan & Konvensi

- Bahasa konten: Indonesia. Tanpa emoji di kode/konten.
- Gaya artikel MDX sama persis dengan posting existing (frontmatter: `title`, `description`,
  `date`, `author`, `category`, `tags`; subtitle `##`).
- Kebijakan kejujuran konten (lanjutan Batch 1): tanpa klien/stats/alamat palsu. Artikel SEO
  lokal TIDAK menge-klaim "berbasis di Yogyakarta" — hanya konteks pasar netral + kriteria
  memilih partner; jasa tetap via daring (WhatsApp-first, reuse `lib/wa.ts`).
- Lead funnel WhatsApp-first; article CTA: link internal (`/layanan`, `/tentang-kami`,
  `#contact`) + WhatsApp prefilled.
- Tidak menambah library baru (RSS dibangun manual).
- Node env: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1` sebelum npm/npx.

## 1. Konten: 6 Artikel Baru

| # | Slug | Judul | Kategori | Fokus keyword |
|---|---|---|---|---|
| 1 | `berapa-biaya-bikin-website` | Berapa Biaya Bikin Website? Ini Rincian & Estimasi Lengkapnya | Jasa Website | biaya buat website |
| 2 | `company-profile-vs-landing-page` | Company Profile vs Landing Page: Pilih Sesuai Kebutuhan Bisnis | Jasa Website | company profile vs landing page |
| 3 | `cara-membuat-toko-online-untuk-usaha-kecil` | Cara Membuat Toko Online untuk Usaha Kecil di Tahun 2026 | E-commerce | cara membuat toko online |
| 4 | `kapan-bisnis-butuh-maintenance-website` | Kapan Bisnismu Butuh Maintenance Website? | Jasa Website | maintenance website |
| 5 | `tanda-bisnis-siap-go-online` | Tanda Bisnis Siap Go Online | UMKM & Digital | go online |
| 6 | `jasa-pembuatan-website-yogyakarta` | Jasa Pembuatan Website Yogyakarta: Cara Memilih Partner yang Tepat | Jasa Website | jasa website jogja |

- Panjang: 700–1.000 kata; frontmatter `date` di-stagger `2026-08-14` s.d. `2026-08-19`
  (tidak melewati hari ini); `author: "Tim KantongIn"`.
- Interlinking (selain related-posts otomatis dari kategori/tags):
  - 1 ↔ `#contact`/estimator + `cara-memilih-jasa-pembuatan-website`
  - 2 ↔ `landing-page-vs-toko-online` + 1
  - 3 ↔ `landing-page-vs-toko-online` + 1
  - 4 ↔ `/layanan` + `/tentang-kami`
  - 5 ↔ `pentingnya-website-untuk-umkm` + 3
  - 6 ↔ `cara-memilih-jasa-pembuatan-website` + 1
- Taksonomi tidak berubah: kategori tetap 3 (`Jasa Website`, `E-commerce`, `UMKM & Digital`);
  total posting 9.

## 2. JSON-LD BreadcrumbList & ItemList

Di `components/common/JsonLd.tsx` (pola meniru `JsonLdFaq` existing):

- Builder murni `buildBreadcrumbList(items: { name, url }[])`:
  `BreadcrumbList` dengan `itemListElement` ber-posisi 1-based; URL absolut dari
  `siteConfig.url`; item terakhir tanpa properti `item` (halaman saat ini).
- Builder murni `buildItemList(items: { name, url }[])`: `ItemList` serupa.
- Komponen `JsonLdData({ data })`: men-render `<script type="application/ld+json">`
  (dangerouslySetInnerHTML) — dipakai agar test mudah dan tidak ada lib baru.
- Pemakaian:
  - `app/blog/[slug]/page.tsx` — BreadcrumbList `Blog › <Kategori> › <Judul>`.
  - `app/blog/kategori/[slug]/page.tsx` — BreadcrumbList `Blog › Kategori › <Nama>`.
  - `app/blog/page.tsx` — ItemList semua artikel (`/blog/<slug>`).
  - `app/layanan/page.tsx` — BreadcrumbList `Beranda › Layanan` + ItemList 6 layanan
    (url `/layanan#<anchor>`; pastikan `id` pada tiap section layanan ada/ditambahkan).

## 3. RSS Feed `/feed.xml`

- `lib/feed.ts` (baru): `buildFeedXml()` → RSS 2.0, tanpa dependency.
  - Channel: `title` = `siteConfig.name` + tagline, `link` = `siteConfig.url`, `description`,
    `lastBuildDate` (posting terbaru), `generator`.
  - Tiap item: `title`, `link`, `guid` (permalink), `pubDate` (RFC 2822), `description`
    (escaped HTML).
- `app/feed.xml/route.ts` (baru): GET → `Response` XML,
  `Content-Type: application/rss+xml; charset=utf-8`; `runtime = "nodejs"`.
- `app/layout.tsx`: metadata `alternates.types["application/rss+xml"] = "/feed.xml"`.

## 4. Verifikasi & Testing

### 4.1 Unit (vitest)

- `components/common/JsonLd.test.ts`: tambah kasus `buildBreadcrumbList` & `buildItemList`
  (URL absolut, item terakhir tanpa `item`, urutan/posisi benar).
- `lib/feed.test.ts` (baru): memuat `title`/`guid` tiap posting, item terkini duluan,
  escape HTML pada description.
- `app/blog/_posts.test.ts`: total posting 9, kategori tetap 3.

### 4.2 e2e (Playwright)

- `e2e/blog.spec.ts`: loop 6 slug baru — judul ter-render; BreadcrumbList ada di detail artikel
  dan halaman kategori.
- `e2e/seo-pages.spec.ts`: ItemList di `/blog` & `/layanan`; BreadcrumbList di `/layanan`;
  `/feed.xml` → 200 + `application/rss+xml` + memuat judul artikel terbaru.

### 4.3 Gate

- `npm run lint` 0 error; `npm test` hijau; `npm run build` sukses (+6 halaman statis artikel +
  `/feed.xml`); `npx playwright test` hijau.
- Setelah deploy: curl produksi — feed 200, artikel baru 200, JSON-LD Breadcrumb/ItemList ada
  di HTML.

## 5. Strategi Pengiriman

Branch `feat/seo-konten` → 6 task berurutan:

1. JSON-LD builders + unit test.
2. Terapkan BreadcrumbList/ItemList di 4 halaman + e2e.
3. `lib/feed.ts` + route `/feed.xml` + `alternates` + unit + e2e.
4. Artikel batch 1: biaya, company-profile-vs-landing-page, cara-membuat-toko-online (+ e2e slug loop).
5. Artikel batch 2: maintenance, tanda-bisnis-siap-go-online, jasa-pembuatan-website-yogyakarta (+ pertahankan e2e).
6. README (struktur + daftar artikel), gate penuh, squash merge ke `main`, hapus branch, push, verifikasi produksi.

## File yang Terdampak

- `components/common/JsonLd.tsx` + `JsonLd.test.ts`
- `app/blog/[slug]/page.tsx`, `app/blog/kategori/[slug]/page.tsx`, `app/blog/page.tsx`
- `app/layanan/page.tsx`
- `lib/feed.ts` + `lib/feed.test.ts` (baru)
- `app/feed.xml/route.ts` (baru)
- `app/layout.tsx`
- `app/blog/_posts/*.mdx` (×6 baru)
- `README.md` (struktur proyek + daftar artikel)
- `e2e/blog.spec.ts`, `e2e/seo-pages.spec.ts`