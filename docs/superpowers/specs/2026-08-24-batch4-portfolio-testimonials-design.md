# Desain Batch 4: Portfolio + Testimonials

**Tanggal:** 2026-08-24
**Status:** Disetujui (rencana Batch 4)
**Induk:** `2026-08-24-kantongin-composition-upgrade-design.md`

## Konteks

Kedua seksi ini adalah seksi bukti sosial utama sebelum Pricing. Portfolio sudah
punya filter kategori + dialog detail berisi metrics; Testimonials sudah punya
carousel Embla matang (autoplay, progress bar, reduced-motion). Upgrade bersifat
memperkuat bukti tanpa rombakan struktur.

## Portfolio — bukti hasil selalu terlihat + indeks editorial

Masalah: pada layar ≥ md, judul & hasil kampanye hanya muncul saat hover
(`md:opacity-0`), sehingga bukti konversi tidak terlihat sekilas; kartu juga
belum punya bahasa editorial seperti kartu lain yang sudah di-upgrade.

Perubahan (`PortfolioCard`):

- **Chip hasil persisten**: `project.result` tampil sebagai chip pill
  backdrop-blur di kiri-bawah panel gradient — selalu terlihat, bukan hanya hover.
- **Label indeks editorial**: nomor `01`–`06` (berdasarkan posisi di `projects`,
  stabil lintas filter) di pojok kanan-atas panel gradient, tipografi besar
  semi-transparan ala ghost number.
- Overlay hover diringkas: judul + tombol "Lihat Detail" tetap, duplikasi
  teks hasil dihapus (sudah ada chip).
- **Glow halus**: section memakai utilitas `.glow-section` (konsisten Statistics).
- Footer kartu, filter pills, dialog detail, dan anchor `#portfolio` tidak berubah.

## Testimonials — aksen editorial ringan

- `SectionHeading` → `size="display"` (tetap center).
- **Tanda kutip dekoratif**: glyph kutip serif besar dengan `.text-gradient`
  di atas quote, menggantikan ikon Quote dalam lingkaran sebagai elemen pembuka.
- Deskripsi seksi dipertajam agar paralel gaya copy baru.
- Struktur carousel, autoplay, progress bar, dan navigasi tidak diubah.

## Verifikasi

- Id section tetap (`#portfolio`, `#testimonials`) — E2E tanpa perubahan.
- Unit test baru: Portfolio (chip hasil persisten, indeks editorial, filter,
  dialog), Testimonials (heading display, glyph kutip dekoratif).
- Gerbang: lint + test + build + E2E; Lighthouse median 3 sampel vs baseline main
  (perf 74 / a11y 96 tidak boleh turun signifikan).
- Branch `feat/portfolio-testimonials`, squash merge ke `main`.
