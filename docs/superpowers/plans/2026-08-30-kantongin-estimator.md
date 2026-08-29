# Plan: Estimasi Harga & Wizard Konsultasi (Kelompok C)

Referensi desain: `docs/superpowers/specs/2026-08-30-kantongin-estimator-design.md`
Branch: `feat/estimator` (dari `main` @ `264ddd2`)

## Ringkasan

Kalkulator harga interaktif + wizard multi-langkah yang menggantikan form
kontak di beranda, estimator ringkas di `/layanan`, terhubung lewat query
`?estimasi=`, semuanya berujung ke WhatsApp prefilled. Logika harga di
`lib/estimator.ts` (murni, ter-unit-test); UI berbagi `PriceEstimator`.

Gate akhir: lint 0 error · unit 118 · build 23 halaman · e2e 19 tes
(`e2e/contact.spec.ts` digantikan `e2e/estimator.spec.ts`).

## Task

### Task 1 — Model harga & pesan (lib)
- `lib/estimator.ts`: tipe `EstimatorServiceId`, `EstimatorAddonId`,
  `EstimatorBudgetId`, katalog (4 base, 5 add-on, budgetRanges),
  `computeEstimate`, `formatRp`, `encodeEstimatePayload`/`decodeEstimatePayload`.
- `lib/estimator.test.ts`: ~6 kasus.
- `lib/schemas/forms.ts`: + `estimateContactSchema` & `EstimateContactValues`.
- `lib/wa.ts`: + `estimateToWhatsAppMessage(values)`.

Verifikasi: `npx vitest run lib/estimator.test.ts` (+ schema) hijau.

### Task 2 — Komponen bersama
- `components/common/PriceEstimator.tsx` (client, controlled): radio kartu
  4 layanan, checkbox 5 add-ons, pilih budget, breakdown live.

Verifikasi: tsc + dirender manual di dev.

### Task 3 — Wizard beranda (ganti ContactSection)
- `components/sections/EstimateWizard.tsx` (client, lazy): 3 langkah +
  progress + validasi Zod per langkah; sidebar info kontak; id `#contact`;
  preseed dari `?estimasi=`.
- Hapus `components/sections/ContactSection.tsx` + `ContactSection.test.tsx`.
- Update `LazySections.tsx` (LazyContactSection → LazyEstimateWizard) dan
  `app/page.tsx`.

Verifikasi: dev manual — alur 3 langkah, submit buka wa.me berisi rincian.

### Task 4 — Estimator di /layanan
- `components/sections/EstimatorCard.tsx` (client): `PriceEstimator` + CTA
  WhatsApp langsung + CTA cross-page `/?estimasi=`.
- Sisip di `app/layanan/page.tsx` (setelah steps, sebelum FAQ).

Verifikasi: dev manual — CTA cross-page membawa pilihan ke beranda.

### Task 5 — Preseed & README
- Wizard baca/decode `?estimasi=` → inisialisasi state.
- `README.md`: struktur konten + fitur estimator + alur WA.

Verifikasi: dev manual cross-page preseed dari `/layanan`.

### Task 6 — E2E & gate penuh
- `e2e/estimator.spec.ts` (4 tes): wizard beranda → pesan WA berisi layanan +
  estimasi + budget; `/layanan` estimator → cross-page preseed di beranda.
- Gate: `npm run lint` (0 err), `npm test` (~109), `npm run build` (23),
  `npx playwright test` (21). Perbaiki kegagalan bila ada.
- Commit Task per bagian (gaya repo `feat(...)`).

## Finalisasi
- `git diff main feat/estimator` kosong setelah squash.
- Squash merge `feat/estimator` → `main`, hapus branch, `git push origin main`.
- Verifikasi produksi: wizard beranda (#contact), estimator `/layanan`,
  link wa.me prefilled, preseed `/?estimasi=`.

## Konteks tambahan
- Jalankan perintah dengan prefix: `source ~/.nvm/nvm.sh >/dev/null && nvm use
  >/dev/null 2>&1 && ...` (v22.23.2). `rg` tidak ada — pakai `grep`.
- Playwright: webServer build+start port 3100; e2e mengetik-check repo.
- Nomor WA `6285775149968`; `WA_CHAT_MESSAGE` konstanta shared.
- Deviasi yang disepakati: perilaku wizard diuji lewat e2e (bukan
  unit-render), konsisten dengan konvensi repositori untuk halaman/komponen
  interaktif besar; logika murni tetap unit-test.