# Legitimasi & Brand (Batch 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menuntaskan fondasi profesionalisme KantongIn: email kontak aktif, bersih dari warisan identitas agensi digital lama, halaman error berbingkai brand, dan rename anchor internal cara kerja.

**Architecture:** Perubahan kecil yang tersebar di config (`constants/site.ts`), branding (`app/opengraph-image.tsx` + 3 halaman legal), rename simbol internal alur "Proses", halaman error baru (`app/not-found.tsx`, `app/error.tsx`), serta ops/README. Semua mengikuti pola yang ada — tidak ada arsitektur baru.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn/ui (`Button`), lucide-react, Vitest, Playwright.

## Global Constraints

- Node: prefix semua perintah dengan `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 &&`.
- Tidak ada emoji di kode; salinan (copy) dalam Bahasa Indonesia.
- JANGAN commit `.env.local` (berisi `VERCEL_OIDC_TOKEN`).
- Email kontak yang ditampilkan: `abinawahasan@gmail.com`. Jalur kirim email (Resend) tetap dormant — API `/api/contact` & `/api/newsletter` TIDAK diubah.
- Domain tetap `https://kantongin-beige.vercel.app`.
- Konvensi commit: `<type>(<scope>): <description>` imperatif.
- Alur kerja: branch `fix/legitimasi-brand` → commit per tugas → gate penuh hijau → squash merge ke `main` → delete branch → push.
- Kode Java/TypeScript: Prettier style, `"` ganda, indentasi 2 spasi, tanpa titik koma.
- TDD: tulis test gagal dulu → verifikasi gagal → implementasi → verifikasi lulus → commit.

---

### Task 1: Email Kontak & Footer

**Files:**
- Modify: `constants/site.ts:6-10`
- Test: `constants/site.test.ts:12-14`
- Modify: `components/layout/Footer.tsx:2,46-96`
- Test: `e2e/home.spec.ts:50-56`

**Interfaces:**
- Consumes: `siteConfig` (`constants/site.ts`), `Logo`, `SocialIcon`.
- Produces: `siteConfig.email = "abinawahasan@gmail.com"` — dipakai otomatis oleh `EstimateWizard.tsx:201`, `JsonLd.tsx:10`, halaman legal, dan footer.

- [ ] **Step 1: Update unit test — email kontak terisi**

Di `constants/site.test.ts:14`, ganti:
```ts
expect(siteConfig.email).toBe("");
```
menjadi:
```ts
expect(siteConfig.email).toBe("abinawahasan@gmail.com");
```

- [ ] **Step 2: Verifikasi test gagal**

Run: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && npx vitest run constants/site.test.ts`
Expected: FAIL pada assertion email (`toBe("")` vs `"abinawahasan@gmail.com"`).

- [ ] **Step 3: Implementasi `constants/site.ts`**

Ganti baris 6-10:
```ts
  // CATATAN: `kantongin.com` bukan milik kami. URL di bawah memakai deployment
  // Vercel aktif; ubah saat punya domain sendiri. Email dikosongkan sampai ada
  // domain untuk alamat bisnis - isi dengan alamat yang benar sebelum produksi.
  url: "https://kantongin-beige.vercel.app",
  email: "",
```
menjadi:
```ts
  // CATATAN: `kantongin.com` bukan milik kami. URL di bawah memakai deployment
  // Vercel aktif; ubah saat punya domain sendiri. Email bisnis ditampilkan via
  // mailto; jalur kirim email (Resend) tetap dormant sampai `RESEND_*` terisi.
  url: "https://kantongin-beige.vercel.app",
  email: "abinawahasan@gmail.com",
```

- [ ] **Step 4: Verifikasi unit test lulus**

Run: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && npx vitest run constants/site.test.ts`
Expected: PASS.

- [ ] **Step 5: Tulis test e2e footer — tautan email tampil**

Di `e2e/home.spec.ts`, dalam test `"footer menampilkan tautan sosial"` (baris 50-56), tambahkan setelah assertion Instagram:
```ts
    await expect(page.getByRole("link", { name: "abinawahasan@gmail.com" })).toBeVisible();
```

- [ ] **Step 6: Implementasi footer — baris email**

Di `components/layout/Footer.tsx`:
1. Baris 2, tambah `Mail` ke import lucide-react:
```ts
import { ArrowRight, Check, Mail } from "lucide-react";
```
2. Di dalam kolom brand, setelah `</ul>` socials (baris 95) dan sebelum `</div>` penutup kolom (baris 96), tambahkan:
```tsx
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
            >
              <Mail className="size-4" aria-hidden="true" />
              {siteConfig.email}
            </a>
```

- [ ] **Step 7: Verifikasi e2e footer lulus**

Run: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && npx playwright test e2e/home.spec.ts`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add constants/site.ts constants/site.test.ts components/layout/Footer.tsx e2e/home.spec.ts
git commit -m "feat(contact): aktifkan email kontak bisnis di konfigurasi dan footer"
```

---

### Task 2: Bersihkan Warisan Branding Lama

**Files:**
- Modify: `app/opengraph-image.tsx:5,52`
- Modify: `app/syarat-ketentuan/page.tsx:5-8,21-27,66-80`
- Modify: `app/kebijakan-privasi/page.tsx:22-23,31-33,77-80`
- Modify: `app/kebijakan-cookie/page.tsx:53-56`
- Test: `e2e/seo-pages.spec.ts` (tambah 1 test)

**Interfaces:**
- Consumes: `siteConfig` (email, tagline).
- Produces: halaman legal tanpa kata "template awal"/"affiliate"/"Digital Marketing"; tanggal pembaruan "30 Agustus 2026".

- [ ] **Step 1: Tulis test e2e legal — identitas bisnis saat ini**

Tambahkan di akhir `e2e/seo-pages.spec.ts` dalam describe yang ada:
```ts
  test("halaman legal mencerminkan identitas bisnis saat ini", async ({ page }) => {
    for (const path of ["/kebijakan-privasi", "/syarat-ketentuan", "/kebijakan-cookie"]) {
      await page.goto(path);
      await expect(page.locator("body")).not.toContainText("template awal");
      await expect(page.locator("body")).not.toContainText(/affiliate|kreator|Digital Marketing/i);
      await expect(page.locator("body")).toContainText("30 Agustus 2026");
    }
  });
```

- [ ] **Step 2: Verifikasi test gagal**

Run: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && npx playwright test e2e/seo-pages.spec.ts`
Expected: FAIL (halaman legal masih memuat "template awal" dan "updated 23 Agustus 2026"; syarat-ketentuan memuat "affiliate").

- [ ] **Step 3: Implementasi `app/opengraph-image.tsx`**

1. Tambah import siteConfig setelah baris 1:
```ts
import { siteConfig } from "@/constants/site";
```
2. Baris 5:
```ts
export const alt = "KantongIn — " + siteConfig.tagline;
```
3. Ganti isi `<div>` subjudul (baris 52):
```tsx
          {siteConfig.tagline}
```

- [ ] **Step 4: Implementasi `app/syarat-ketentuan/page.tsx`**

1. Baris 7-8 (metadata description):
```ts
  description: "Ketentuan penggunaan layanan pembuatan website KantongIn.",
```
2. Paragraf "Layanan Kami" (baris 23-26) diganti:
```tsx
      <p>
        KantongIn menyediakan jasa pembuatan dan pengelolaan website profesional:
        landing page, website company profile, toko online/e-commerce, aplikasi web
        (web app), serta layanan optimasi, maintenance, dan konsultasi website. Ruang
        lingkup spesifik setiap layanan diatur dalam proposal atau perjanjian kerja
        sama tersendiri.
      </p>
```
3. Baris 13: `updated="30 Agustus 2026"`.
4. Hapus blockquote "template awal" (baris 77-80).

- [ ] **Step 5: Implementasi `app/kebijakan-privasi/page.tsx`**

1. Baris 23: `Data bisnis: nama brand, jenis usaha, dan kebutuhan website.`
2. Baris 32: `Mengelola kerja sama layanan dan komunikasi operasional.`
3. Baris 12: `updated="30 Agustus 2026"`.
4. Hapus blockquote "template awal" (baris 77-80).

- [ ] **Step 6: Implementasi `app/kebijakan-cookie/page.tsx`**

1. Baris 13: `updated="30 Agustus 2026"`.
2. Hapus blockquote "template awal" (baris 53-56).

- [ ] **Step 7: Verifikasi e2e legal lulus**

Run: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && npx playwright test e2e/seo-pages.spec.ts`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add app/opengraph-image.tsx app/syarat-ketentuan/page.tsx app/kebijakan-privasi/page.tsx app/kebijakan-cookie/page.tsx e2e/seo-pages.spec.ts
git commit -m "fix(branding): bersihkan warisan identitas agensi digital lama dari konten"
```

---

### Task 3: Rename Anchor Internal Proses

**Files:**
- Modify: `lib/howTabs.ts:1-8`
- Modify: `lib/reveal-section.ts:3-14`
- Modify: `constants/steps.ts:6-9,14-17,41-44`
- Test: `constants/steps.test.ts:6,11`
- Modify: `components/sections/HowItWorks.tsx:103,108`
- Modify: `components/sections/LazySections.tsx:49`
- Modify: `e2e/home.spec.ts:40`

**Interfaces:**
- Consumes: `HowFlow` type, `flows[]` (`constants/steps.ts`), `HOW_FLOW_ANCHORS`/`flowForAnchor` (`lib/howTabs.ts`), `LAZY_SECTION_ANCHORS` (`lib/reveal-section.ts`).
- Produces: tipe `HowFlow = "new-site" | "maintenance"`; anchor `#website-baru`/`#maintenance`; `Flow.anchorId = "website-baru" | "maintenance"`. Label UI tetap "Website Baru"/"Maintenance & Support".

- [ ] **Step 1: Update unit test `constants/steps.test.ts`**

Baris 6:
```ts
expect(flows.map((f) => f.id)).toEqual(["new-site", "maintenance"]);
```
Baris 11:
```ts
expect(flows.map((f) => f.anchorId)).toEqual(["website-baru", "maintenance"]);
```

- [ ] **Step 2: Verifikasi test gagal**

Run: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && npx vitest run constants/steps.test.ts`
Expected: FAIL (masih `["brand","creator"]`).

- [ ] **Step 3: Implementasi `lib/howTabs.ts` (baris 1-8)**

```ts
export type HowFlow = "new-site" | "maintenance";

export const HOW_FLOW_ANCHORS = ["#website-baru", "#maintenance"] as const;

export const FLOW_BY_ANCHOR: Record<(typeof HOW_FLOW_ANCHORS)[number], HowFlow> = {
  "#website-baru": "new-site",
  "#maintenance": "maintenance",
};
```
(Baris 10-39 tidak berubah.)

- [ ] **Step 4: Implementasi `constants/steps.ts`**

- Flow "Website Baru": `id: "new-site"`, `anchorId: "website-baru"` (baris 15,17).
- Flow "Maintenance & Support": `id: "maintenance"`, `anchorId: "maintenance"` (baris 42,44).
- Tipe `Flow` (baris 6-11): `id: "new-site" | "maintenance"`.

- [ ] **Step 5: Implementasi `lib/reveal-section.ts` (baris 3-14)**

Ganti `"#affiliate",` → `"#website-baru",` dan `"#creators",` → `"#maintenance",` di `LAZY_SECTION_ANCHORS`.

- [ ] **Step 6: Implementasi `components/sections/LazySections.tsx:49`**

```tsx
    <LazyMount hashes={["#how-it-works", "#website-baru", "#maintenance"]}>
```

- [ ] **Step 7: Implementasi `components/sections/HowItWorks.tsx`**

- Baris 103: `useState<Flow["id"]>("new-site")`
- Baris 108: `setActiveId(requested ?? fromHash ?? "new-site")`

- [ ] **Step 8: Verifikasi unit test lulus**

Run: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && npx vitest run constants/steps.test.ts`
Expected: PASS.

- [ ] **Step 9: Update e2e `e2e/home.spec.ts:40`**

```ts
for (const id of ["home", "services", "portfolio", "website-baru", "pricing", "faq", "contact", "how-it-works"]) {
```

- [ ] **Step 10: Verifikasi e2e home lulus**

Run: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && npx playwright test e2e/home.spec.ts`
Expected: PASS.

- [ ] **Step 11: Commit**

```bash
git add lib/howTabs.ts lib/reveal-section.ts constants/steps.ts constants/steps.test.ts components/sections/HowItWorks.tsx components/sections/LazySections.tsx e2e/home.spec.ts
git commit -m "refactor(how): ganti anchor sisa lama #affiliate/#creators dengan #website-baru/#maintenance"
```

---

### Task 4: Halaman Error Berbingkai Brand

**Files:**
- Create: `app/not-found.tsx`
- Create: `app/error.tsx`
- Test: `e2e/seo-pages.spec.ts` (tambah 1 test)

**Interfaces:**
- Consumes: `Button` (`@/components/ui/button` — variant `default`, `outline`, prop `asChild`), `buildWhatsAppLink` (`lib/wa.ts`).
- Produces: jalur `/halaman-tidak-ada` (dan path tak dikenal lain) menampilkan heading "Halaman tidak ditemukan" + CTA Beranda.

- [ ] **Step 1: Tulis test e2e 404**

Tambahkan ke `e2e/seo-pages.spec.ts` dalam describe yang ada:
```ts
  test("halaman tak dikenal menampilkan 404 berbingkai brand", async ({ page }) => {
    await page.goto("/halaman-tidak-ada");
    await expect(
      page.getByRole("heading", { name: /Halaman tidak ditemukan/ })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Kembali ke Beranda/ })).toHaveAttribute(
      "href",
      "/"
    );
    await expect(page.getByRole("link", { name: /Konsultasi via WhatsApp/ })).toHaveAttribute(
      "href",
      /wa\.me\//
    );
  });
```

- [ ] **Step 2: Verifikasi test gagal**

Run: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && npx playwright test e2e/seo-pages.spec.ts`
Expected: FAIL (default 404 Next tidak memuat "Halaman tidak ditemukan").

- [ ] **Step 3: Implementasi `app/not-found.tsx`**

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/wa";

const WA_NOT_FOUND_MESSAGE =
  "Halo KantongIn, saya menemukan halaman yang tidak ditemukan di situs Anda.";

export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center"
    >
      <Link
        href="/"
        aria-label="KantongIn - Beranda"
        className="inline-flex select-none items-baseline text-xl font-extrabold tracking-tight text-foreground transition-opacity hover:opacity-90"
      >
        Kantong
        <span className="text-primary">In</span>
        <span aria-hidden="true" className="text-primary">
          .
        </span>
      </Link>
      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        404
      </p>
      <h1 className="mt-2 max-w-xl text-3xl font-bold text-foreground sm:text-4xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-4 max-w-md text-muted">
        Halaman yang kamu cari mungkin telah dipindahkan atau tidak pernah ada.
        Kembali ke beranda atau tanyakan langsung lewat WhatsApp.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
        <Button asChild variant="outline">
          <a
            href={buildWhatsAppLink(WA_NOT_FOUND_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Konsultasi via WhatsApp
          </a>
        </Button>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Implementasi `app/error.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("KantongIn error boundary:", error);
  }, [error]);

  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Terjadi kendala
      </p>
      <h1 className="mt-2 max-w-xl text-3xl font-bold text-foreground sm:text-4xl">
        Ada yang tidak beres
      </h1>
      <p className="mt-4 max-w-md text-muted">
        Silakan coba lagi, atau kembali ke beranda dan lanjutkan menjelajah.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()}>Coba lagi</Button>
        <Button asChild variant="outline">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Verifikasi e2e 404 lulus**

Run: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && npx playwright test e2e/seo-pages.spec.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/not-found.tsx app/error.tsx e2e/seo-pages.spec.ts
git commit -m "feat(ui): halaman not-found dan error boundary berbingkai brand"
```

---

### Task 5: Ops & README

**Files:**
- Modify: `.env.local` (hapus 1 baris — JANGAN commit)
- Modify: `README.md:16-20`

**Interfaces:**
- Consumes: `siteConfig.email` (Task 1).
- Produces: README menyebut email kontak aktif; `.env.local` bebas `kantongin.com`.

- [ ] **Step 1: Bersihkan `.env.local`**

Hapus baris `RESEND_FROM_DOMAIN=kantongin.com` dari `.env.local` (jangan menyentuh `VERCEL_OIDC_TOKEN`).

Run: `grep -c "RESEND_FROM_DOMAIN" .env.local`
Expected: `0`.

- [ ] **Step 2: Update README**

Di `README.md`, setelah bullet WhatsApp (baris 16-20), tambahkan bullet:
```md
- Email kontak bisnis aktif: `abinawahasan@gmail.com` ditampilkan (mailto) di
  wizard `#contact`, footer, halaman legal, dan JSON-LD. Jalur kirim email
  (Resend) tetap dormant sampai `RESEND_*` terisi.
```

- [ ] **Step 3: Verifikasi**

Run: `git status --short`
Expected: hanya file terduga yang berubah; `.env.local` TIDAK muncul sebagai untracked/modified di git.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs(readme): catat email kontak aktif; jalur kirim email tetap dormant"
```

---

### Task 6: Gate Penuh & Integrasi

**Files:** semua file dari Task 1-5.

- [ ] **Step 1: Run lint**

Run: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && npm run lint`
Expected: `0 errors` (2 warning `_opts` lama diperbolehkan).

- [ ] **Step 2: Run seluruh unit test**

Run: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && npm test`
Expected: semua PASS (jumlah file 27+, termasuk `site.test.ts` & `steps.test.ts` yang diubah).

- [ ] **Step 3: Run build**

Run: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && npm run build`
Expected: sukses, semua route ter-prerender termasuk halaman legal baru.

- [ ] **Step 4: Run seluruh e2e**

Run: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && npx playwright test`
Expected: semua PASS (19 + 2 test baru = 21).

- [ ] **Step 5: Verifikasi visual cepat (opsional)**

Run dev server, buka `/halaman-tidak-ada` dan halaman legal; pastikan tidak ada `<main>` bersarang dan skip-link tetap menuju konten.

- [ ] **Step 6: Commit sisa (bila ada) lalu squash merge + push + verifikasi produksi**

```bash
git checkout main && git pull --ff-only origin main
git merge --squash fix/legitimasi-brand && git commit -m "feat: legitimasi & brand — email kontak, bersihkan identitas lama, halaman error"
git branch -D fix/legitimasi-brand
git push origin main
```
Lalu verifikasi produksi (`https://kantongin-beige.vercel.app`):
- `/halaman-tidak-ada` → heading "Halaman tidak ditemukan" + CTA Beranda/WA.
- Halaman legal tidak memuat "template awal"/"affiliate"; tanggal "30 Agustus 2026".
- Kartu email tampil di wizard `#contact`; email di footer; JSON-LD Organization memuat `email`.
- Beranda masih utuh (H1 tidak terpangkas).