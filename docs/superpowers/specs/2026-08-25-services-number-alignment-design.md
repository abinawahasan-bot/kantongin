# Desain: Penyelarasan Nomor Kartu Services

**Tanggal:** 2026-08-25
**Status:** Disetujui (dialog brainstorming)
**Induk:** `2026-08-24-batch3-services-mid-design.md`

## Masalah

Pada section Services, nomor `01` (kartu flagship Affiliate Marketing) ditulis
sebaris dengan judul dan terdorong ke kanan oleh ikon besar, sedangkan nomor
`02`–`07` (kartu grid) berdiri sendiri di atas ikon. Padding luar juga berbeda
(`p-8 sm:p-10` vs `p-6`). Hasilnya, saat dipindai vertikal dari kartu 1 ke
kartu 2, nomor tidak segaris — dilaporkan user setelah melihat halaman live.

## Solusi (pendekatan A: sejajar sempurna)

Perubahan hanya di `components/sections/Services.tsx`.

1. **Ekstrak komponen `ServiceIndex`** (DRY — label indeks kini dipakai dua
   tempat): span `text-xs font-bold tracking-[0.2em] text-primary/50`, nilai
   `String(value).padStart(2, "0")`, `aria-hidden`.
2. **Restruktur `FlagshipCard`:**
   - Nomor `01` menjadi baris pertama kartu (gaya sama dengan ServiceCard),
     bukan lagi sebaris dengan judul.
   - Padding luar disamakan `p-6` agar tepi kiri `01` dan `02` segaris
     sempurna.
   - Struktur: nomor → baris `[ikon besar | judul + deskripsi + chip + link]`
     dengan gap internal lebih lega (`gap-6`) supaya rasa flagship tetap.
   - Identitas flagship dipertahankan lewat ikon `size-16`, judul
     `text-xl sm:text-2xl`, dan chip horizontal — bukan lewat posisi nomor.
3. **`ServiceCard`:** ganti span nomor manual dengan `<ServiceIndex>` — tanpa
   perubahan visual.
4. **Warna nomor diseragamkan** ke `text-primary/50` (sebelumnya flagship
   memakai `/60`).

## Kontrak Test

Test unit existing (`Services.test.tsx`) hanya menguji teks heading, daftar
layanan, span bento `md:col-span-6`, dan keberadaan label `01`/`07` — semuanya
tetap lulus tanpa perubahan.

Test baru (TDD): label `01` pada kartu flagship dirender **sebelum** judul dan
ikon dalam urutan DOM (mencerminkan posisi "di atas"), memakai
`compareDocumentPosition` / urutan teks.

## Verifikasi

- `npm run lint` + `npm test`.
- Cek visual langsung di `localhost:3000` (dev server Turbopack).
- Branch `fix/services-number-alignment`, squash merge ke `main`.
