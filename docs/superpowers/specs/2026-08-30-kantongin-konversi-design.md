# Design — Konversi & Lead Capture: CTA Blog, Popup Kontekstual, Tracking, Cleanup

- Tanggal: 2026-08-30
- Proyek: KantongIn (kantongin-beige.vercel.app)
- Branch: `feat/konversi` (dari `main` @ `4906050`)
- Status: Disetujui user (§1–§3)

## Tujuan

Batch penutup roadmap: meningkatkan konversi lalu lintas organik menjadi percakapan
WhatsApp serta merapikan dead code email.

1. **CTA Blog** — menangkap pembaca artikel (top-of-funnel) yang selama ini tanpa ajakan.
2. **Popup WhatsApp kontekstual** — sopan, sekali per sesi, bisa ditutup.
3. **Event tracking** — `track()` Vercel di CTA kunci; siap dikoleksi saat upgrade Pro
   (Hobby tidak mengoleksi custom events — disepakati, kode tetap dipasang).
4. **Cleanup dead code** — hapus tuntas `/api/contact`, `/api/newsletter`,
   `lib/rate-limit`, schema terkait, dan ENV Resend/Upstash dari README.
5. **Micro-copy** — baris reasuransi jujur, terpusat di `constants/`.

Semua lead tetap **WhatsApp-first** (tanpa layanan email/database baru).
Baris yang terpusat tanpa klaim palsu (tidak memakai "balasan cepat", "garansi
paling murah", dsb).

## 1. CTA Blog & Micro-copy

- **CTA akhir artikel**: `components/blog/ArticleCta.tsx` (server murni). Kartu
  gradient konsisten dengan halaman lain; judul singkat + kalimat pendukung +
  tombol "Konsultasi Gratis via WhatsApp" (`buildWhatsAppLink`) + micro-copy.
  Pesan prefilled per kategori via map `BLOG_CTA_MESSAGES` (default +
  1–2 varian kategori), di `constants/copy.ts`.
- **CTA bawah index blog**: panel yang sama dengan pesan default di bagian bawah
  `app/blog/page.tsx`.
- **Micro-copy terpusat**: `constants/copy.ts` — `CTA_REASSURANCE`,
  `WA_CHAT_MESSAGE`, `BLOG_CTA_MESSAGES`. `CTA_REASSURANCE` disisipkan di bawah
  CTA utama hero home, kartu paket harga (home & `/harga`), dan di CTA baru.

## 2. Popup WhatsApp Kontekstual

`components/common/ConversionPopup.tsx` (client) + `lib/conversion.ts` (logika
murni, diuji unit).

**Logika trigger** (`lib/conversion.ts`):
- Halaman izin popup: blog detail (`/blog/<slug>`), `/layanan`, `/harga`.
- Blog detail → tampil setelah **scroll 60%** artikel.
- `/layanan` & `/harga` → tampil saat **exit-intent** (mouse tinggalkan viewport atas).
- **Sekali per sesi**: flag di `sessionStorage` (`kong.popup.seen`);
  dismiss menulis flag; klik CTA juga menulis flag.
- Home **tidak** menampilkan popup.

**Komponen**: dialog aksesibel (`role="dialog"`, `aria-modal`, fokus terkelola,
`Escape` menutup), tombol ×, tombol utama WA prefilled
"Halokanti..." — teks apa pun jujur tanpa urgency.

**Kinerja**: dimuat dinamis/hidrasi ringan pada halaman yang diizinkan; tidak
menambah beban RSC besar (pola `LazyMount`/client kecil).

## 3. Event Tracking

`lib/analytics.ts` — pembungkus tipis `track()` dari `@vercel/analytics` (client):
- `trackConversion(event, payload?)` — event whitelist (kebab-case):
  `cta_whatsapp_click` (`section`), `wizard_submit`, `estimator_submit`,
  `blog_cta_click`, `popup_shown`, `popup_dismissed`, `popup_cta_click`.
- Payload datar, ≤2 properti, tipe primitif.
- Guard `siteConfig.analyticsEnabled` (default true) + `NODE_ENV`.
- Dipasang di: tombol WA utama (hero, WhatsAppFloat, wizard submit,
  estimator), CTA blog baru, popup (shown/dismissed/cta).

Catatan jujur: Hobby tidak mengoleksi custom events; kode siap penuh saat Pro.

## 4. Cleanup Dead Code

- Hapus `app/api/contact/route.ts`, `app/api/newsletter/route.ts`.
- `lib/schemas/forms.ts`: hapus `contactSchema`/`ContactValues`/
  `newsletterSchema`/`NewsletterValues`; **pertahankan `estimateContactSchema`**
  (dipakai `EstimateWizard` & `lib/wa`).
- Hapus `lib/rate-limit.ts` + `lib/rate-limit.test.ts` (satu-satunya pemakai
  adalah dua route yang dihapus).
- Hapus pemakaian `resend`/`@upstash/redis` bila sudah tanpa pengguna.
- `README.md`: hapus ENV `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`,
  `RESEND_FROM_DOMAIN`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

## 5. Verifikasi & Testing

### Unit (vitest)

- `lib/conversion.test.ts`: tabel skenario — scroll 60% (blog), exit-intent
  (layanan/harga), flag sesi (sudah dilihat → tidak muncul), halaman terlarang
  (home) → `shouldShow = false`.
- `lib/analytics.test.ts`: whitelist event; payload flatten (≤2 properti, primitif);
  disabled flag → no-op.
- `lib/schemas/forms.test.ts`: buang kasus contact/newsletter; pertahankan
  kasus estimateContact.
- `constants/copy.test.ts` (opsional): CTA_REASSURANCE non-kosong.

### e2e

- Blog detail: CTA akhir artikel terlihat + `href` `wa.me`; index blog: panel CTA.
- `/harga` & `/layanan`: popup muncul setelah emulasi exit-intent
  (`page.mouse.move(400, -10)`); tutup → tidak muncul lagi di sesi yang sama;
  CTA popup `wa.me`.
- Blog detail: popup muncul setelah scroll 60% (`page.evaluate` set scrollTop);
  sekali per sesi.
- Home: **tanpa popup**; micro-copy reasuransi CTA terlihat.
- Cleanup: `POST /api/contact` & `/api/newsletter` → 404; halaman utama hijau.

### Gate & Deploy

- `npm run lint` 0 error; `npm test` hijau; `npm run build` sukses;
  `npx playwright test` hijau.
- Squash merge → `main`, hapus branch, `git push origin main`, verifikasi
  produksi: CTA blog & popup, `/api/contact` 404, home utuh.

## 6. Strategi Pengiriman

Branch `feat/konversi` dari `main@4906050` → 5 task:

1. Cleanup dead code (routes, schemas, rate-limit, README ENV) — unit + e2e 404.
2. `lib/analytics.ts` + pasang `track()` di CTA kunci.
3. Blog CTA (`ArticleCta` + panel index) + `constants/copy.ts`.
4. `ConversionPopup` + `useConversionTrigger` + wiring rute + e2e popup.
5. README (konversi & ENV) + gate penuh + squash merge → main + push + verifikasi.

## File yang Terdampak

- Dihapus: `app/api/contact/route.ts`, `app/api/newsletter/route.ts`,
  `lib/rate-limit.ts`, `lib/rate-limit.test.ts`, `lib/resend.ts` (bila tidak
  terpakai).
- `lib/schemas/forms.ts` + `lib/schemas/forms.test.ts`
- Baru: `lib/analytics.ts`, `lib/conversion.ts` (+ test), `constants/copy.ts`,
  `components/blog/ArticleCta.tsx`, `components/common/ConversionPopup.tsx`,
  `e2e/conversion.spec.ts`.
- Diubah: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`,
  `app/layanan/page.tsx`, `app/harga/page.tsx`, `app/page.tsx` (micro-copy),
  `components/common/WhatsAppFloat.tsx`, `components/sections/EstimatorCard.tsx`,
  `components/sections/EstimateWizard.tsx`, `components/common/PricingCard.tsx`
  (micro-copy), `README.md`.