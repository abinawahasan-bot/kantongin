# Design — SEO & Konten: Kategori Blog, Related Posts, Halaman Layanan & Tentang Kami

- Tanggal: 2026-08-30
- Proyek: KantongIn (kantongin-beige.vercel.app)
- Branch: `feat/seo-content` (dari `main` @ `8e30482`)
- Status: Disetujui user (iterasi Kelompok B)

## Tujuan

Meningkatkan kualitas SEO dan konten situs dengan:

1. Taksonomi blog (kategori) + halaman kategori.
2. Blok "artikel terkait" pada halaman detail blog (otomatis dari kategori & tag).
3. OG image dinamis per halaman.
4. Halaman statis SEO `/layanan` dan `/tentang-kami`.

Iterasi lengkap dalam satu branch, squash merge ke `main` (pola sama dengan Kelompok A).

## Batasan & Konvensi

- Bahasa konten: Indonesia. Tanpa emoji di kode.
- Branding: KantongIn — "Bikin Punya Kantong Kencang".
- Node env: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1` sebelum npm/npx.
- Lead funnel tetap WhatsApp-first (reuse `lib/wa.ts`).
- Tidak menambah library baru.
- Home page (`/`) dan `opengraph-image.tsx` default TIDAK berubah.

## 1. Blog: Kategori

### 1.1 Skema frontmatter

`app/blog/_posts.ts`:

- Tambahkan field wajib `category: string` pada `PostFrontmatter` dan `postFrontmatterSchema` (`z.string().trim().min(1)`).
- Export tipe baru `PostCategory` (= string) dan helper `getCategories(): string[]` (urut abjad, unik, dari `posts`).
- Tags tetap opsional (`tags: string[]`) sebagai taksonomi sekunder.

### 1.2 Migrasi posting

Tambahkan `category` pada 3 posting existing:

| Slug | category |
|---|---|
| `cara-memilih-jasa-pembuatan-website` | `Jasa Website` |
| `landing-page-vs-toko-online` | `E-commerce` |
| `pentingnya-website-untuk-umkm` | `UMKM & Digital` |

### 1.3 Halaman kategori

- Route statis: `app/blog/kategori/[slug]/page.tsx`
  - `dynamicParams = false`
  - `generateStaticParams()` dari daftar kategori (slugified).
  - Slugifikasi: lowercase, spasi → `-`, hapus karakter selain `[a-z0-9-]`.
- Konten: breadcrumb `Blog › Kategori › Nama`, header (nama + jumlah posting + deskripsi singkat otomatis), grid kartu posting (reuse kartu dari halaman blog index).
- Tidak ada posting di kategori → `notFound()`.
- Metadata: `title: "<Kategori> | Blog"`, description otomatis, OG image dinamis (Seksi 3).

### 1.4 Tags jadi link

- Pada halaman blog index & detail posting: tampilkan tag sebagai `<Link>` ke `/blog/kategori/<slugified-tag>` bila tag tersebut adalah kategori yang dikenal; selain itu span biasa. (Tags: "Tips", "Digital", "Website" ≠ kategori → span.)

## 2. Blog: Related Posts

### 2.1 Util `getRelatedPosts(slug, limit = 3)`

Di `app/blog/related.ts`, ekspor fungsi murni:

1. Ambil posting target beserta `category` + `tags`.
2. Urutkan semua posting lain (exclude target) dengan skor:
   - `+2` kategori sama.
   - `+1` per tag yang sama (cap kontribusi tag di 2).
3. Ambil `limit` tertinggi.
4. Jika hasil `< limit`, isi sisa dengan posting terbaru yang belum terpilih (urutan `posts` sudah ter-sort tanggal desc).

### 2.2 UI detail posting

- Di bawah konten MDX, blok `<section aria-labelledby="artikel-terkait">` berjudul "Artikel terkait":
  - Kartu padat: judul, deskripsi line-clamp-2, tanggal. Link ke `/blog/<slug>`.
  - Jika tidak ada related sama sekali (hanya 1 posting), sembunyikan blok.
- Tambahkan breadcrumb kecil di atas judul: `Blog › <kategori> › <judul>` (kategori link ke halaman kategori; halaman ini sendiri sebagai teks).

## 3. OG Image Dinamis

### 3.1 Route

- `app/og-image/route.tsx` (`ImageResponse`, `runtime = "nodejs"`):
  - Query: `title` (wajib), `subtitle` (opsional), `accent` (opsional, hex; default `#22C55E`).
  - Ukuran 1200×630, `contentType = "image/png"`.
  - Layout: latar `#020617`, judul besar putih (auto-wrap, max ~3 baris), subtitle abu `#94A3B8`, badge "KantongIn" di atas, strip aksen hijau di kiri/tepi.
  - `title` kosong/tidak ada → 400 (Return `new Response("Bad Request", { status: 400 })`).
- Helper `buildOgImageUrl(title, subtitle?)` di `lib/og.ts`: return `/og-image?title=...&subtitle=...` (encodeURIComponent; hanya sertakan subtitle bila ada). Unit test di `lib/og.test.ts`.

### 3.2 Pemakaian metadata

- Blog index (`app/blog/page.tsx`): `openGraph.images` + `twitter.image` = `buildOgImageUrl("Wawasan & strategi terbaru", siteConfig.tagline)`.
- Detail posting: `buildOgImageUrl(post.title, siteConfig.tagline)`.
- `/layanan`: `buildOgImageUrl("Layanan Pembuatan Website", siteConfig.tagline)`.
- `/tentang-kami`: `buildOgImageUrl("Tentang KantongIn", siteConfig.tagline)`.
- Home: tetap `opengraph-image.tsx` default. (Tidak diubah.)

## 4. Halaman /tentang-kami

- `app/tentang-kami/page.tsx` — statis, `<main id="main">`, judul/desc metadata, OG image dinamis, plus inline JSON-LD `AboutPage` ringkas (`@type: "AboutPage"`) di dalam halaman.
- Blok:
  1. Intro: label "Tentang Kami", judul, paragraf naratif posisi KantongIn (tagline), CTA WhatsApp prefilled + link `/layanan`.
  2. Nilai-nilai: grid `constants/values.ts` (icon + judul + deskripsi).
  3. Fakta cepat: stats dari `constants/stats.ts` (kartu angka).
  4. Partner: `constants/partners.ts` (logo/nama teks sesuai render existing — ikuti pola section TrustedBy).
  5. Testimoni: 3 kartu `constants/testimonials.ts`.
  6. CTA penutup: WhatsApp prefilled (`WA_CHAT_MESSAGE`).
- Tanpa foto tim (tidak ada aset).

## 5. Halaman /layanan

- `app/layanan/page.tsx` — statis, `<main id="main">`, metadata + OG dinamis.
- Blok:
  1. Intro: label "Layanan", judul, paragraf pembuka, stats singkat, CTA WhatsApp prefilled.
  2. Layanan (6, dari `constants/services.ts`): tiap layanan = section dengan icon, judul, deskripsi, `points` sebagai checked-list, dan link/kondisi "Konsultasi layanan ini" → WhatsApp prefilled `Halo KantongIn, saya ingin konsultasi <judul layanan>.`
  3. Cara kerja: urutan `constants/steps.ts` (langkah bernomor).
  4. FAQ: subset `constants/faqs.ts` via `<details>` + `JsonLdFaq` (reuse `components/common/JsonLd.tsx` export `JsonLdFaq`).
  5. Garansi & komitmen: paragraf + poin, CTA tutup WhatsApp prefilled + link `/tentang-kami`.
- JsonLd `Service` per layanan TIDAK dibuat (beranda sudah `ProfessionalService`; hindari duplikasi tanpa nilai).

## 6. Navigasi & SEO Global

### 6.1 Navigation (`constants/navigation.ts`)

- Mega menu "Layanan": tambah item pertama `Lihat semua layanan → /layanan`; item keahlian tetap anchor `#services`.
- Tambah item `{ label: "Tentang Kami", href: "/tentang-kami" }` setelah "Beranda" (mega tidak diperlukan).
- Item "Blog" tetap `/blog`.
- Cek Footer: jika ada kolom link navigasi, tambah "Tentang Kami" & "Layanan" (sesuaikan saat implementasi).

### 6.2 Sitemap (`app/sitemap.ts`)

Tambah entry:

| URL | priority | frequency |
|---|---|---|
| `/layanan` | 0.8 | monthly |
| `/tentang-kami` | 0.6 | yearly |
| `/blog/kategori/*` (per kategori) | 0.6 | weekly |

Posting blog tetap 0.7/monthly; home 1.0.

- `robots.ts` tidak berubah (semua indexable).

## 7. Verifikasi & Testing

### 7.1 Unit (vitest)

- `app/blog/_posts.test.ts`: tambah kasus `category` wajib (missing → throw), `getCategories()` unik/urut, slugifikasi kategori.
- `app/blog/related.ts` (baru): `getRelatedPosts` — prioritas kategori > tag, exclude diri, fallback isi terbaru, limit.
- `lib/og.test.ts` (baru): URL ke-encode dengan benar, subtitle opsional.
- `app/layanan/page.test.tsx` & `app/tentang-kami/page.test.tsx` (baru): render tiap blok utama ada.

### 7.2 e2e (Playwright)

- `e2e/blog.spec.ts`: + kasus — halaman kategori menampilkan kartu; detail posting menampilkan "Artikel terkait"; breadcrumb kategori.
- `e2e/seo-pages.spec.ts` (baru): `/layanan` & `/tentang-kami` render blok utama; `/og-image?title=Test` → status 200 + `content-type: image/png`.

### 7.3 Gate

- `npm run lint` (0 error), `npm test` (hijau), `npm run build` (17+ halaman statis; kategori = 3 halaman baru), `npx playwright test` hijau.
- Verifikasi curl produksi setelah deploy: OG route 200, halaman baru ada di sitemap/JSON-LD.

## 8. Strategi Pengiriman

- Branch `feat/seo-content` → 6 task berurutan:
  1. Blog: skema `category` + migrasi + util kategori + halaman kategori (+ unit).
  2. Blog: `getRelatedPosts` + blok "Artikel terkait" + breadcrumb (+ unit).
  3. OG dinamis: route `/og-image` + `lib/og.ts` (+ unit + e2e).
  4. /tentang-kami (+ unit + e2e).
  5. /layanan (+ unit + e2e).
  6. Navigation, sitemap, dokumen (README), gate penuh, verifikasi.
- Squash merge ke `main`, hapus branch, push (Vercel auto-deploy).

## File yang Terdampak

- `app/blog/_posts.ts`, `_posts.test.ts`, `page.tsx`, `[slug]/page.tsx`
- `app/blog/kategori/[slug]/page.tsx` (baru), `app/blog/related.ts` (baru) + test
- `app/og-image/route.tsx` (baru), `lib/og.ts` (baru) + `lib/og.test.ts`
- `app/layanan/page.tsx` + test (baru), `app/tentang-kami/page.tsx` + test (baru)
- `constants/navigation.ts`, `app/sitemap.ts`
- `README.md` (struktur proyek + fitur)
- `e2e/blog.spec.ts`, `e2e/seo-pages.spec.ts` (baru)