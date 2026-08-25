# Desain: Portofolio Foto Duotone Editorial

**Tanggal:** 2026-08-25
**Status:** Disetujui (dialog brainstorming)
**Induk:** `2026-08-24-batch4-portfolio-testimonials-design.md`

## Masalah

Kartu portofolio hanya memakai gradasi warna CSS sebagai panel visual — tidak
ada foto sama sekali, sehingga seksi terasa datar dibanding section lain.

## Keputusan (dialog user)

- **Sumber gambar:** stok foto Unsplash (lisensi bebas komersial), diunduh ke
  `public/portfolio/<id>.jpg`, dioptimasi `next/image` (WebP/AVIF otomatis +
  lazy-load). Tanpa dependensi baru.
- **Gaya visual:** duotone editorial — foto grayscale dengan tint gradasi
  warna kategori (`mix-blend-multiply`); saat hover foto menjadi full-color +
  zoom halus. Identitas warna tiap kategori tetap kuat.
- **Layout dipertahankan:** masonry columns, filter chip, nomor ghost,
  chip hasil persisten, overlay "Lihat Detail".

## Perubahan

1. **Aset:** `public/portfolio/` berisi 6 foto bertema konteks:
   `glowskin-ramadan` (skincare), `kopi-nusantara-launch` (kopi),
   `fitfuel-endorsement` (fitness), `pesona-wisata-series` (wisata),
   `lokalkita-kedai-paman` (fashion/kedai), `technest-social` (gadget).
2. **Data** (`constants/portfolio.ts`): field baru `image: string` dan
   `imageAlt: string` pada `PortfolioProject`; keenam item diisi. Field
   `gradient` dipertahankan sebagai sumber warna tint duotone.
3. **Kartu** (`components/sections/Portfolio.tsx`): panel gradasi diganti
   lapisan `<Image fill sizes object-cover>` + tint overlay; hover:
   `grayscale-0` + `scale-105`. Nomor ghost/chip/overlay dipertahankan di atas
   foto (scrim gelap bawah menjaga kontras).
4. **Dialog detail:** header memakai foto proyek yang sama dengan tint serupa;
   `alt=""` dekoratif karena judul sudah tampil.

## Kontrak Test

Test baru: setiap proyek merender elemen `<img>` dengan sumber yang mengandung
`/portfolio/<id>.jpg` (setelah decode URI) dan atribut `alt` persis sama dengan
`imageAlt`. Test existing (heading/filter, chip persisten, indeks editorial,
dialog metrics) tetap hijau tanpa perubahan.

## Verifikasi

- `npm test` (suite penuh) + `npm run lint`.
- Cek visual langsung di Brave `localhost:3000/#portfolio`.
- Branch `feat/portfolio-photo`, squash merge ke `main`.
