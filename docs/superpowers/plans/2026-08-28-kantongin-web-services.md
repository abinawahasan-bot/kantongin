# Pivot KantongIn → Jasa Pembuatan Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah landing page KantongIn dari agency Digital Marketing & Creator Collaboration menjadi jasa pembuatan website, dengan struktur design (komponen, layout, animasi) dipertahankan.

**Architecture:** Content-swap terarah. Semua data di `constants/` diganti + copy komponen seksi diperbarui; komponen UI/common (`components/ui`, GlowCard, BentoGrid, Reveal, SectionHeading), animasi, dan `lib/howTabs.ts` tidak disentuh.

**Tech Stack:** Next.js 16 (Turbopack) / React 19 / TS / Tailwind v4 / Vitest / Playwright.

## Global Constraints

- Section ID tetap: `home`, `trusted`, `statistics`, `services`, `why`, `how-it-works` (tabpanel `affiliate`/`creators`), `portfolio`, `testimonials`, `pricing`, `cta`, `faq`, `contact`.
- `lib/howTabs.ts`, `HowItWorks.tsx` logic tab, animasi, dan struktur `components/ui` **tidak berubah**.
- Copy dalam Bahasa Indonesia, gaya konsisten dengan copy existing.
- Semua gerbang wajib hijau: `nvm use && npm run lint`, `npm test`, `npm run build`, `npm run test:e2e`.
- Commit convention per git-workflow rules (`feat`/`fix`/`docs`), imperative.

---

### Task 1: Brand & Metadata — `constants/site.ts` + `app/layout.tsx`

**Files:**
- Modify: `constants/site.ts`
- Modify: `app/layout.tsx` (keywords)
- Create: `constants/site.test.ts`
- Test: `constants/site.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it } from "vitest";
import { siteConfig } from "./site";

describe("siteConfig", () => {
  it("brand tetap KantongIn dengan tagline & deskripsi pivot website", () => {
    expect(siteConfig.name).toBe("KantongIn");
    expect(siteConfig.tagline).toBe("Jasa Pembuatan Website Profesional");
    expect(siteConfig.description).toContain("pembuatan website");
  });

  it("url & whatsapp dipertahankan", () => {
    expect(siteConfig.url).toBe("https://kantongin-beige.vercel.app");
    expect(siteConfig.socials.whatsapp).toContain("wa.me/6285");
    expect(siteConfig.email).toBe("");
  });
});
```

- [ ] **Step 2: Run test, verify fails**
- [ ] **Step 3: Implement** — `constants/site.ts` tagline/description baru (lihat design doc) + `app/layout.tsx` keywords baru.
- [ ] **Step 4: Run test, verify passes**
- [ ] **Step 5: Commit** `feat(brand): pivot tagline & metadata ke jasa pembuatan website`

---

### Task 2: Hero + Mockup Browser — `Hero.tsx` + `DashboardMockup.tsx`

**Files:**
- Modify: `components/sections/Hero.tsx` (H1, subtitle, CTA, KpiChip)
- Modify: `components/sections/hero/DashboardMockup.tsx` (konten → mockup studio)
- Create: `components/sections/hero/DashboardMockup.test.tsx`
- Modify: `e2e/home.spec.ts` (heading + CTA regex)

- [ ] Write failing test (DashboardMockup): render → `kantongin • studio`, "Proyek Aktif", "Performa Website".
- [ ] Implement: Hero H1 "Website Profesional yang Mendatangkan Pelanggan" (highlight "Mendatangkan Pelanggan"), subtitle pivot, CTA "Konsultasi Gratis", KpiChip "98% Klien Puas" & "100+ Website Selesai"; DashboardMockup → panel Proyek Aktif + Performa Website (PageSpeed/SEO/Mobile), label "kantongin • studio", badge "Launch Minggu Ini"; pertahankan wrapper/glow/traffic-light.
- [ ] Update `e2e/home.spec.ts`: `/Tumbuhkan Penjualan/` → `/Website Profesional/`, `"Mulai Kampanye"` → `/Konsultasi Gratis/`.
- [ ] Verify unit + `npm run test:e2e home`; Commit `feat(hero): pivot hero jadi mockup studio`.

---

### Task 3: Services — `constants/services.ts` + `Services.tsx`

**Files:**
- Modify: `constants/services.ts`, `components/sections/Services.tsx` (import/icon map + SectionHeading), `components/sections/Services.test.tsx`
- Test: `components/sections/Services.test.tsx`

- [ ] Update test: heading `/Semua Jenis Website/`, `getByText("E-commerce / Toko Online")`, `"Website Landing Page"`, `"Maintenance & Support"`, indeks `"05"`.
- [ ] Implement: 5 layanan (`shoppingCart`, `layoutTemplate`, `building2`, `monitorSmartphone`, `wrench`); icon map lucide `ShoppingCart, LayoutTemplate, Building2, MonitorSmartphone, Wrench`; heading "Semua Jenis Website yang Anda Butuhkan".
- [ ] Verify; Commit `feat(services): layanan jasa pembuatan website`

---

### Task 4: HowItWorks — `constants/steps.ts` + heading

**Files:**
- Modify: `constants/steps.ts`, `components/sections/HowItWorks.tsx` (heading)
- Create: `constants/steps.test.ts`

- [ ] Test: id `["brand","creator"]`, label `["Website Baru","Maintenance & Support"]`, anchor `["affiliate","creators"]`, 4 langkah per alur.
- [ ] Implement steps baru (design doc §7); heading "Proses Pengerjaan yang Jelas & Terukur".
- [ ] Verify; Commit `feat(how-it-works): alur pembuatan website & maintenance`

---

### Task 5: WhyChooseUs — `constants/values.ts` + heading

**Files:**
- Modify: `constants/values.ts`, `components/sections/WhyChooseUs.tsx` (heading)
- Create: `components/sections/WhyChooseUs.test.tsx`

- [ ] Test: heading `/Mengapa Klien Memilih Kami/` + 4 judul nilai.
- [ ] Implement 4 nilai (design doc §6) & heading.
- [ ] Verify; Commit `feat(why-choose-us): nilai jual jasa website`

---

### Task 6: Partners — `constants/partners.ts`

**Files:**
- Modify: `constants/partners.ts`, `components/sections/TrustedBy.test.tsx`
- [ ] Update test `"Nusagro"` → `"RumahKreasi"`; implement 8 nama placeholder.
- [ ] Verify; Commit `feat(trusted-by): daftar klien placeholder`

---

### Task 7: Statistics — `constants/stats.ts` + `Statistics.tsx`

**Files:**
- Modify: `constants/stats.ts`, `components/sections/Statistics.tsx` (heading + featured label/desc), `components/sections/Statistics.test.tsx`

- [ ] Update test: heading `/Hasil Nyata, Website Terukur/`, labels `["Website Selesai","Brand & UMKM","Rating Klien","Tahun Pengalaman"]`, featured `"Klien Merekomendasikan"`.
- [ ] Implement stats (featured `98% Klien Merekomendasikan` di indeks 4) + copy.
- [ ] Verify; Commit `feat(statistics): angka project website`

---

### Task 8: Testimonials — `constants/testimonials.ts` + heading

**Files:**
- Modify: `constants/testimonials.ts`, `components/sections/Testimonials.tsx` (description), `components/sections/Testimonials.test.tsx`
- [ ] Update test `/Bukan janji manis/i` → `/tumbuh bersama hasil kerja kami/i`; implement 5 testimoni placeholder + description.
- [ ] Verify; Commit `feat(testimonials): testimoni klien jasa website`

---

### Task 9: Portfolio — `constants/portfolio.ts` + heading

**Files:**
- Modify: `constants/portfolio.ts`, `components/sections/Portfolio.tsx` (heading), `components/sections/Portfolio.test.tsx`

- [ ] Update test: heading `/Hasil Nyata, Website Terukur/`, dialog desc `/toko online lengkap/i`, metric `"+2x"`.
- [ ] Implement 4 kategori + 6 project placeholder (reuse image lama).
- [ ] Verify; Commit `feat(portfolio): portofolio website placeholder`

---

### Task 10: Pricing — `constants/pricing.ts` + chips

**Files:**
- Modify: `constants/pricing.ts`, `components/sections/Pricing.tsx` (chips), Create: `constants/pricing.test.ts`
- [ ] Test: 3 paket `["Landing Page","Company Profile","Custom / Web App"]`, harga `Rp 2,5 jt`/`Rp 4,9 jt`/`Custom`, highlight Company Profile.
- [ ] Implement + chips baru.
- [ ] Verify; Commit `feat(pricing): paket harga jasa website`

---

### Task 11: FAQ — `constants/faqs.ts`

**Files:**
- Modify: `constants/faqs.ts`, `components/sections/FAQ.tsx` (description), Create: `constants/faqs.test.ts`
- [ ] Test: ≥7 pertanyaan, `faqs[0]` berisi "berapa lama pengerjaan", ada match "domain & hosting".
- [ ] Implement 7 pertanyaan + description FAQ.
- [ ] Verify; Commit `feat(faq): FAQ jasa pembuatan website`

---

### Task 12: Contact — schema + `ContactSection.tsx` + API

**Files:**
- Modify: `lib/schemas/forms.ts`, `components/sections/ContactSection.tsx`, `app/api/contact/route.ts`, Create: `lib/schemas/forms.test.ts`

- [ ] Test schema: isian lengkap sukses; tanpa `service` gagal.
- [ ] Implement: tambah `service` (`z.string().min(1, "Pilih jenis layanan")`), native select "Jenis Layanan" (style Input), placeholder subjek "Contoh: Proyek website", description section; API route tambah `Jenis Layanan` ke HTML email.
- [ ] Verify unit + `npm run test:e2e contact`; Commit `feat(contact): field jenis layanan`

---

### Task 13: CTA + Footer + Navigasi copy

**Files:**
- Modify: `components/sections/CTASection.tsx`, `components/layout/Footer.tsx`, `constants/navigation.ts`, `e2e/home.spec.ts` (tambah assertion link "Proses")

- [ ] Test: e2e nav assertion `link "Proses"` → `#how-it-works`.
- [ ] Implement: CTA "Siap Punya Website Profesional?"/"Konsultasi Gratis"; footer serviceLinks + newsletter desc; navItems hapus "Affiliate"/"Kreator", tambah "Proses", mega Layanan 2 kolom.
- [ ] Verify `npm run test:e2e home`; Commit `feat(copy): CTA, footer, dan navigasi jasa website`

---

### Task 14: Blog — ganti post + tes + copy

**Files:**
- Create: `app/blog/_posts/pentingnya-website-untuk-umkm.mdx`, `landing-page-vs-toko-online.mdx`, `cara-memilih-jasa-pembuatan-website.mdx`
- Delete: `affiliate-marketing-untuk-umkm.mdx`, `memilih-kreator-endorsement.mdx`
- Modify: `app/blog/_posts.test.ts`, `app/blog/page.tsx`, `e2e/blog.spec.ts`

- [ ] Update `_posts.test.ts` (`getPost("pentingnya-website-untuk-umkm")`) & `e2e/blog.spec.ts` (judul/slug baru).
- [ ] Implement 3 MDX baru + hapus 2 lama + copy page.tsx.
- [ ] Verify `npm test -- app/blog` + `npm run test:e2e blog`; Commit `feat(blog): artikel tips website untuk UMKM`

---

### Task 15: Finalisasi — README + gerbang CI penuh

**Files:**
- Modify: `README.md`
- [ ] Update README deskripsi. Run `nvm use && npm run lint`, `npm test`, `npm run build`, `npm run test:e2e` — semua hijau. Commit `docs: update README untuk pivot jasa website`

---

### Task 16: Preview & konfirmasi

- [ ] `curl http://localhost:3000` → 200 (restart dev server bila perlu).
- [ ] Buka ulang di Brave & konfirmasi visual tiap seksi dengan user.

---

**Self-review (plan time):**
- Cakupan spec §1–14 → Task 1–14 ✓
- No placeholders; semua isi constants + assertion test lengkap ✓
- Konsistensi: featured stat indeks 4 (`Statistics.tsx` `FEATURED = stats[4]`), slug blog konsisten di MDX/_posts.test/e2e ✓