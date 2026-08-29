# Desain: Upgrade Konversi & Kepercayaan (Kelompok A)

- **Tanggal**: 2026-08-29
- **Status**: Disetujui (2026-08-29)
- **Branch**: `feat/conversion-whatsapp`

## Konteks & Tujuan

Website KantongIn (jasa pembuatan website) sudah tayang di Vercel namun memiliki
beberapa titik lemah pada jalur konversi dan elemen kepercayaan:

1. **Form kontak tidak berfungsi** — mengandalkan backend email (Resend) yang
   belum dikonfigurasi (`RESEND_API_KEY`, `RESEND_FROM_DOMAIN`, `siteConfig.email`
   kosong) sehingga selalu membalas `503 "Layanan belum dikonfigurasi"`.
2. **Newsletter juga rusak** — form langganan di footer memakai jalur yang sama
   sehingga gagal di submit.
3. **Schema.org minim** — hanya `Organization` + `FAQPage`; belum ada tipe bisnis
   jasa, `priceRange`, `contactPoint`, `areaServed`; `email: ""` bocor kosong.
4. **Tombol WhatsApp polos** — semua link `wa.me` tanpa pesan awal, padahal
   WhatsApp adalah kanal utama bisnis.
5. **Konten placeholder fiktif** — portofolio (6 project), testimoni (5), partner
   (8) ditampilkan sebagai nyata tanpa label; berisiko merusak kepercayaan.

**Keputusan kunci** (dari sesi brainstorming): fokus jalur lead ke **WhatsApp**
karena belum ada infrastruktur email; semua elemen email dinonaktifkan atau
disembunyikan sampai infra email tersedia; konten placeholder **ditandai sebagai
ilustrasi** agar transparan.

## Pendekatan

Hindari ketergantungan backend: manfaatkan WhatsApp yang sudah aktif
(`wa.me/6285775149968`) sebagai kanal penerima lead utama. Halaman tetap berfungsi
penuh tanpa perlu akun email/domain baru, dan ketika infra email tersedia nanti,
jalur `/api/contact` dan `/api/newsletter` bisa diaktifkan kembali.

## Keputusan Desain

### 1. WhatsApp Lead Capture

- **Helper baru `lib/wa.ts`**:
  - `whatsappNumber` — nomor `6285775149968` (diambil dari `siteConfig`? — tidak;
    cukup konstanta di helper, tapi nomor harus satu sumber. Keputusan: helper
    membaca `siteConfig.socials.whatsapp` sudah berisi URL utuh, jadi helper
    mengekstrak suffix `/`-terakhir sebagai nomor dan membangun ulang dengan
    `?text=`).
  - `buildWhatsAppLink(message: string): string` — menghasilkan
    `https://wa.me/6285775149968?text=<url-encoded>` (pakai `encodeURIComponent`).
  - `contactToWhatsAppMessage(values: ContactValues): string` — menyusun pesan
    berformat:
    ```
    Halo KantongIn, saya tertarik jasa pembuatan website! 👋
    (baris kosong)
    Nama: ...
    Email: ...
    Jenis Layanan: ...
    Subjek: ...
    Pesan: ...
    ```
- **Form kontak (`ContactSection`)**:
  - `onSubmit` tidak lagi `fetch("/api/contact")`; setelah validasi (r.h.f +
    `contactSchema` tetap), buka `window.open(buildWhatsAppLink(...), "_blank")`.
  - Status sukses ditampilkan sebagai "Buka WhatsApp untuk melihat pesan Anda."
    (pesan singkat), form di-`reset`, tanpa status submit jaringan.
  - Tombol diubah: **"Kirim via WhatsApp"** + ikon WhatsApp; kelas/ikon lama
    (`Loader2`/`Send`) tidak lagi diperlukan untuk state submitting (state
    `submitting` tidak dipakai untuk jalur WhatsApp — tidak ada async).
  - `role="status"` tetap dipakai untuk umpan balik.
- **Tombol float `WhatsAppFloat`** — `href` memakai `buildWhatsAppLink` dengan
  pesan ajakan: `"Halo KantongIn, saya ingin konsultasi pembuatan website."`
- **Kartu WhatsApp di `ContactSection`** (kolom kiri) — link yang sama dengan
  pesan ajakan prefilled.
- **`/api/contact` dan `/api/newsletter`**: DIBIARKAN (dormant). Form tidak lagi
  memanggilnya. Saat infra email tersedia, cukup isi env + `siteConfig.email` dan
  alihkan kembali. Tidak ada kode yang dihapus dari kedua route ini.

### 2. Schema.org Bisnis (SEO)

`components/common/JsonLd.tsx` — upgrade objek organisasi:

- `@type` menjadi array `["Organization", "ProfessionalService"]`.
- Tambah:
  - `priceRange: "Rp 500 rb - custom"` (mengikuti harga saat ini).
  - `contactPoint`: `{ "@type": "ContactPoint", telephone: "+6285775149968",
    contactType: "sales", availableLanguage: ["id"] }`.
  - `areaServed: "ID"`.
- `email` hanya di-emit bila `siteConfig.email` terisi (jangan `email: ""`).
- LOGO & `sameAs` dipertahankan.
- **TIDAK menambah `aggregateRating`** — rating 4.9 berasal dari testimoni
  ilustratif; memasangnya ke schema berarti menipu Google (pelanggaran pedoman
  structured data). Diaktifkan nanti saat testimoni asli tayang.

### 3. Footer: Hapus Newsletter → "Ikuti Kami"

`components/layout/Footer.tsx`:

- Hapus fungsi `NewsletterForm` dan semua impornya (zodResolver, useForm,
  useState, `Send`/`Check` jika tak terpakai,  React Hook Form, `newsletterSchema`,
  `NewsletterValues`, `MagneticButton`, `Input`, `Button` bila hanya dipakai
  newsletter — verifikasi saat implementasi).
- Kolom ke-4 diisi blok **"Ikuti Kami"**:
  - judul kolom `Ikuti Kami`.
  - prompt singkat: "Tips membangun website & update layanan mengikuti akun kami."
  - tautan Instagram, TikTok, WhatsApp (ikon + label) memakai `siteConfig.socials`;
    tautan WhatsApp memakai `buildWhatsAppLink` dengan ajakan.
- `socialIcons` dan daftar ikon sosial di area logo (kolom 1) tetap.
- `newsletterSchema` **tetap** di `lib/schemas/forms.ts` (masih diuji); tidak
  dipakai UI.

### 4. Label Ilustrasi (transparansi konten)

- **`Portfolio`**: tambahkan satu baris kecil di bawah heading —
  `Catatan: contoh proyek bersifat ilustratif dan akan diperbarui saat klien nyata
  tayang.`
- **`Testimonials`**: baris kecil serupa di bawah heading —
  `Testimoni ilustratif — diisi saat klien nyata tayang.`
- **`TrustedBy`**: ganti label tengah "Dipercaya oleh brand & UMKM ternama" →
  tetap, tapi tambahkan catatan kecil `Nama partner ilustratif.` (di bawah
  marquee atau dekat label).
- **`ContactSection`**: di bawah judul kiri (atau di kolom kiri) tambahkan satu
  baris kecil: `Contoh proyek & testimoni di halaman ini bersifat ilustratif.`
- Gaya: teks kecil `text-muted` (bukan alert/pill mencolok) — transparan tanpa
  merusak estetika.

### 5. Pengujian

- **Unit `lib/wa.test.ts`** (baru):
  - `buildWhatsAppLink` menghasilkan URL `wa.me/6285775149968` dengan param
    `text` ter-encode (spasi → `%20`, karakter khusus).
  - `contactToWhatsAppMessage` menyertakan setiap field dengan label benar.
  - Ekstraksi nomor dari `siteConfig.socials.whatsapp` benar.
- **`lib/schemas/forms.test.ts`** — tanpa perubahan (contactSchema/newsletterSchema
  tidak berubah).
- **E2E `e2e/contact.spec.ts`**:
  - Test 1 "form kontak memvalidasi isian kosong" — update nama tombol menjadi
    "Kirim via WhatsApp".
  - Test 2 "submit valid membuka WhatsApp" — isi form lengkap, stub
    `window.open`, klik submit, `expect(open).toHaveBeenCalledWith` URL yang
    mengandung `wa.me` + `text=` ter-encode (berisi nama pengguna).
  - Test 3 "newsletter…" — **DIHAPUS** (form dihapus). Ganti dengan test bahwa
    kolom "Ikuti Kami" menampilkan tautan sosial (atau cukup hilang dari home
    spec; verifikasi saat implementasi — JANGAN meninggalkan referensi ke form
    yang dihapus).
- **`e2e/home.spec.ts`** — cek apakah merujuk newsletter/portfolio; sesuaikan
  bila perlu.
- **Unit lain yang terpengaruh**: `Testimonials.test.tsx`, `Portfolio.test.tsx`,
  `TrustedBy.test.tsx` — verifikasi render label baru bila mereka memeriksa
  struktur heading (kemungkinan tidak perlu berubah; cek saat implementasi).
- Jalankan: `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e`.

### 6. Verifikasi Manual (browser)

- Scroll penuh halaman, pastikan label ilustrasi tampil di 3 seksi.
- Klik tombol submit form dengan isian valid → tab baru WhatsApp terbuka berisi
  pesan lengkap.
- Tombol float WhatsApp → chat WhatsApp dengan pesan ajakan.
- Footer menampilkan "Ikuti Kami", bukan form email.
- `curl` halaman → JSON-LD mengandung `ProfessionalService`, `priceRange`,
  `contactPoint`, dan TIDAK ada `"email":""`.

## Non-Goals (sengaja tidak dikerjakan)

- Tidak mengonfigurasi Resend/SMTP (belum ada domain/akun).
- Tidak menambah `aggregateRating` ke schema.
- Tidak menambah tombol WhatsApp berulang di hero/pricing (di luar lingkup;
  form + float + kartu kontak sudah cukup untuk iterasi ini).
- Tidak menghapus route `/api/contact` & `/api/newsletter`.

## Dokumentasi

- **README**: perbarui bagian yang menyebut newsletter/email form jika ada;
  catatan "form kontak mengarah ke WhatsApp sampai email dikonfigurasi".
- **`.env.example`**: tambahkan komentar bahwa env email hanya diperlukan saat
  beralih kembali ke jalur email; nilai kosong = WhatsApp aktif.
- Design doc ini menjadi arsip; perubahan konten berikutnya tidak mengubahnya.

## Alur Git

- Branch `feat/conversion-whatsapp` dari `main` (sudah dibuat).
- Commit kecil per tugas (konvensi `feat`, `test`, `docs`, `chore`).
- Setelah semua test & build hijau: squash merge ke `main`, hapus branch,
  push bila diminta user.