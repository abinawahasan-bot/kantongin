# Desain: Estimasi Harga & Wizard Konsultasi (Kelompok C)

Status: **Disetujui** — 30 Agu 2026
Branch: `feat/estimator` (dari `main` @ `264ddd2`)

## Tujuan

Menaikkan kualitas lead dan memperpendek siklus penawaran: pengunjung
mengonfigurasi kebutuhan website di kalkulator harga, melihat estimasi "mulai
dari", lalu rincian pilihan terkirim rapi ke WhatsApp tim. Mengurangi
percakapan bolak-balik "kira-kira berapa biayanya?".

## Keputusan lingkup (konfirmasi user 30 Agu 2026)

1. Kerjakan ketiganya dalam satu alur: **kalkulator harga + multi-step form +
   koneksi keduanya** (pilihan kalkulator diteruskan ke form → WhatsApp).
2. Penempatan: **Beranda + /layanan** — blok kalkulator + form jadi section
   baru di beranda (id tetap `#contact`, menggantikan form kontak lama) dan
   estimator ringkas di `/layanan`; berbagi komponen yang sama (DRY).
3. Jenis yang harganya "Custom" (Web App / Dashboard) **tetap punya angka**
   "mulai dari Rp 5 jt" dengan catatan custom, agar tetap bisa dikalkulasi.
4. Alur cross-page memakai **query param `?estimasi=...`** (encoded JSON
   pilihan) — shareable, tanpa backend/state global.

## Arsitektur

### 1. `lib/estimator.ts` (+ `lib/estimator.test.ts`) — logika murni

Katalog (angka konsisten dengan `constants/pricing.ts`):

| Jenis (id) | Estimasi |
|---|---|
| `landing` — Landing Page | mulai Rp 500 rb |
| `company` — Company Profile | mulai Rp 1,3 jt |
| `ecommerce` — E-commerce / Toko Online | mulai Rp 2,5 jt |
| `webapp` — Web App / Dashboard | mulai Rp 5 jt (label custom) |

Add-ons (berlaku untuk semua jenis, `id` unik):

| Add-on (id) | Penambah |
|---|---|
| `blog` — Blog / Artikel | +Rp 300 rb |
| `store` — Toko online + payment gateway | +Rp 1,5 jt |
| `copywriting` — Copywriting konten | +Rp 250 rb |
| `maintenance` — Maintenance & support (1 bulan) | +Rp 150 rb |
| `api` — Integrasi API / sistem | custom (catatan) |

Contoh komputasi: `computeEstimate("company", ["blog", "maintenance"])`
→ total = 1.300.000 + 300.000 + 150.000 = **mulai Rp 1.750.000**.

Kelengkapan:
- `computeEstimate(serviceId, addonIds)` → `{ service, items[], subtotalLabel }`.
- `formatRp(n)` (mis. `Rp 1.750.000`).
- `budgetRanges`: `below1m` (<1jt), `1to3m` (1–3 jt), `3to5m` (3–5 jt),
  `above5m` (>5 jt), `undecided` (Belum tahu).
- `encodeEstimatePayload` / `decodeEstimatePayload` — encode/decode pilihan
  untuk query `?estimasi=` (JSON ringkas: `{ s, a: [], b }`).

Prinsip: semua keluaran bertuliskan **"mulai dari"** + disclaimer bahwa harga
final mengikuti konsultasi scope. Tidak menjanjikan harga pasti.

### 2. `components/common/PriceEstimator.tsx` — komponen bersama (client, controlled)

- Radio kartu jenis layanan (4).
- Checkbox add-ons (5).
- Pilih budget.
- Panel ringkasan live: breakdown base + tiap add-on + "Estimasi mulai dari
  Rp X" + terpilihnya budget.
- Controlled (`value`/`onChange`) agar wizard bisa mengelola state lintas
  langkah; `/layanan` dan wizard memakai panel yang sama.

### 3. Beranda — `components/sections/EstimateWizard.tsx` (lazy)

Menggantikan `ContactSection` (file + test dihapus), **id section tetap
`#contact`** agar semua anchor lama (nav, footer, CTA, kartu harga) tetap
berfungsi. 3 langkah dengan indikator progress:

1. **Kebutuhan** — `PriceEstimator` (jenis + add-ons + budget + ringkasan).
2. **Detail** — subjek (terisi otomatis dari jenis layanan) + pesan.
3. **Kontak** — nama + email → submit buka WhatsApp.

Validasi per langkah via Zod (`estimateContactSchema`, `zodResolver`).
Sidebar menampung info kontak yang lama (WhatsApp, email bila terisi, jam
respons). Inisialisasi dari `?estimasi=` (useSearchParams, preseed saat
kedatangan).

### 4. `/layanan` — `components/sections/EstimatorCard.tsx`

`PriceEstimator` + breakdown + dua CTA:
- **"Kirim rincian via WhatsApp"** — langsung: pesan = ringkasan pilihan
  (tanpa nama/email).
- **"Konsultasi lewat form di beranda"** → `/?estimasi=<encoded>`.

Disisipkan di `app/layanan/page.tsx` setelah blok proses (steps), sebelum FAQ.

### 5. Schema & pesan WhatsApp

- `lib/schemas/forms.ts` + `estimateContactSchema`:
  - `name`, `email` menurun dari `contactSchema` (sama rule).
  - `service`: enum 4 jenis.
  - `addons`: array id add-on (min 0).
  - `budget`: enum `budgetRanges`.
  - `message`: min 10 karakter (wajib, bukan opsional).
- `lib/wa.ts` + `estimateToWhatsAppMessage(values)` — pesan terstruktur:

```
Halo KantongIn, saya ingin konsultasi pembuatan website!

Nama: {name}
Email: {email}
Jenis Layanan: {service}
Fitur tambahan: Blog (+Rp 300 rb), Maintenance (+Rp 150 rb)
Estimasi awal: mulai dari Rp 1.750.000
Budget: Rp 1–3 jt
Pesan: {message}

(angka estimasi & fitur dapat berubah setelah konsultasi scope)
```

### 6. Pembersihan & tes

- Hapus `components/sections/ContactSection.tsx` + `ContactSection.test.tsx`
  (digantikan wizard). Update `LazySections.tsx` dan `app/page.tsx`.
- Unit: `lib/estimator.test.ts` (estimasi per service, add-on terhitung,
  formatRp, budget, encode/decode).
- E2E (konvensi repo — perilaku diuji lewat e2e, bukan unit-render):
  `e2e/estimator.spec.ts`:
  1. Alur wizard 3 langkah di beranda → setelah submit, link `wa.me` terbuka
     & pesan mengandung layanan + estimasi + budget.
  2. `/layanan` estimator → CTA cross-page memuat `/?estimasi=` → beranda
     preseed (wizard menampilkan pilihan yang sudah dipilih).
- README diperbarui (struktur konten, fitur estimator).

## Non-goals

- Tidak ada backend baru; seluruh alur menuju WhatsApp (jalur lead utama).
- Tidak mengubah `pricingPlans`, halaman, sitemap, atau JSON-LD.
- Tidak menambah dependency (tanpa state library baru; memakai
  `useState` + query param).
- Email/respons tetap dalam sidebar info kontak (dormant bila `email` kosong).

## Dampak

- Build: rute tidak berubah → tetap 23 halaman statis.
- e2e total: `e2e/contact.spec.ts` (2 tes) digantikan `e2e/estimator.spec.ts`
  (4 tes) → 17 − 2 + 4 = **19 test**.
- unit total: 103 + ~15 = **118 test**.