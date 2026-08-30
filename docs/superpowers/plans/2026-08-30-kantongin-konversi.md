# Plan — Konversi & Lead Capture

- Desain: `docs/superpowers/specs/2026-08-30-kantongin-konversi-design.md`
- Branch: `feat/konversi` dari `main @ 4906050`
- Gate: lint 0 error, unit hijau, build sukses, e2e hijau.

## Task 1 — Cleanup dead code

**Hapus:** `app/api/contact/route.ts`, `app/api/newsletter/route.ts`,
`lib/rate-limit.ts`, `lib/rate-limit.test.ts`, (bila tak terpakai) `lib/resend.ts`.

**Ubah:** `lib/schemas/forms.ts` — hapus `contactSchema`/`ContactValues`/
`newsletterSchema`/`NewsletterValues`, pertahankan `estimateContactSchema`;
`lib/schemas/forms.test.ts` — buang kasus yang dihapus; `README.md` — hapus ENV
Resend & Upstash.

**Verifikasi:** unit hijau; e2e: `POST /api/contact` & `/api/newsletter` → 404;
home tetap hijau.
**Commit:** `chore(api): hapus endpoint email & rate-limit yang mati`

## Task 2 — Analytics helper + wiring `track()`

**Baru:** `lib/analytics.ts` — `trackConversion(event, payload?)` whitelist;
guard `siteConfig.analyticsEnabled` + `NODE_ENV`; payload flatten ≤2 properti.
`lib/analytics.test.ts` — whitelist, flatten, disabled no-op.

**Wiring:** `WhatsAppFloat` (klik), hero CTA home (`app/page.tsx`), wizard submit
(`EstimateWizard`), estimator submit (`EstimatorCard`), CTA blog & popup (Task 3/4).

**Verifikasi:** unit hijau; e2e home & estimator tetap hijau.
**Commit:** `feat(analytics): track event CTA WhatsApp, wizard, dan estimator`

## Task 3 — Blog CTA + micro-copy

**Baru:** `constants/copy.ts` — `CTA_REASSURANCE`, `WA_CHAT_MESSAGE_CLOSED`
(revisi `WA_CHAT_MESSAGE` bila sudah ada), `BLOG_CTA_MESSAGES` (default +
varian kategori). `components/blog/ArticleCta.tsx` (server).

**Ubah:** `app/blog/[slug]/page.tsx` (CTA akhir artikel), `app/blog/page.tsx`
(panel bawah), `app/page.tsx` + `components/common/PricingCard.tsx` +
`app/harga/page.tsx` (micro-copy reasuransi).

**e2e:** blog detail & index — CTA terlihat + `wa.me`; home — micro-copy terlihat.
**Verifikasi:** unit (copy test) + e2e blog/home.
**Commit:** `feat(blog): CTA artikel & index dengan micro-copy terpusat`

## Task 4 — Popup kontekstual

**Baru:** `lib/conversion.ts` (logika murni) + `lib/conversion.test.ts`;
`components/common/ConversionPopup.tsx` (client, dialog aksesibel).

**Ubah:** wiring di `app/blog/[slug]/page.tsx`, `app/layanan/page.tsx`,
`app/harga/page.tsx` (render popup + hook trigger); `lib/analytics.ts`
dipakai: `popup_shown`/`popup_dismissed`/`popup_cta_click`.

**e2e:** `e2e/conversion.spec.ts` — emulasi exit-intent di `/harga` & `/layanan`
(popup muncul, sekali per sesi, tutup persist); scroll 60% di blog detail;
home tanpa popup.
**Verifikasi:** unit + e2e conversion + suite e2e penuh.
**Commit:** `feat(conversion): popup WhatsApp kontekstual sekali per sesi`

## Task 5 — README, gate, integrasi

**Langkah:**
- `README.md`: dokumentasi konversi (CTA blog, popup, tracking) & struktur file.
- Gate penuh: `npm run lint`, `npm test`, `npm run build`, `npx playwright test`.
- Squash merge `feat/konversi` → `main`, hapus branch (`-D`), push, verifikasi
  produksi: blog CTA 200 + popup, `/api/contact` 404, home utuh, feed/sitemap utuh.
- **Commit:** `docs(readme): dokumentasi konversi & lead capture` (commit
  terakhir branch).