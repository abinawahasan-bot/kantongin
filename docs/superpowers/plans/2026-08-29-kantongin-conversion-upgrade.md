# Upgrade Konversi & Kepercayaan (Kelompok A) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengaktifkan jalur lead WhatsApp, meng-upgrade schema.org, menghapus newsletter rusak, dan menandai konten ilustratif — tanpa ketergantungan backend email.

**Architecture:** Halaman tetap 100% client-side untuk jalur lead (form → `wa.me` prefilled). Route `/api/contact` & `/api/newsletter` dibiarkan dormant. Schema.org dibangun via fungsi murni yang diuji.

**Tech Stack:** Next.js 16 (App Router, Turbopack), TypeScript, React Hook Form + Zod, Vitest, Playwright, framer-motion, lucide-react.

## Global Constraints

- Branch `feat/conversion-whatsapp` (sudah dibuat). Commit per tugas, konvensi `<type>(<scope>): <desc>` imperatif.
- **Tanpa emoji di kode** (aturan gaya repo) — pesan WhatsApp template tanpa `👋`.
- Tidak menambah `aggregateRating`. `email` tidak pernah di-emit sebagai string kosong.
- `newsletterSchema`, `/api/contact`, `/api/newsletter` tetap utuh.
- Verifikasi penuh tiap tugas: `npm run lint && npm test` dan kala ada perubahan e2e: `npm run test:e2e`. Build: `npm run build`.

---

### Task 1: Helper `lib/wa.ts` + unit test

**Files:**
- Create: `lib/wa.ts`
- Create: `lib/wa.test.ts`

**Interfaces:**
- Produces: `waNumber(): string`, `buildWhatsAppLink(message: string): string`, `contactToWhatsAppMessage(values: ContactValues): string`

- [ ] **Step 1 — tulis test gagal** (`lib/wa.test.ts`)

```ts
import { describe, expect, it } from "vitest";
import { buildWhatsAppLink, contactToWhatsAppMessage, waNumber } from "./wa";
import type { ContactValues } from "./schemas/forms";

describe("lib/wa", () => {
  it("mengekstrak nomor dari siteConfig.socials.whatsapp", () => {
    expect(waNumber()).toBe("6285775149968");
  });
  it("menyusun link wa.me dengan text ter-encode", () => {
    expect(buildWhatsAppLink("Halo KantongIn!")).toBe(
      "https://wa.me/6285775149968?text=Halo%20KantongIn%21"
    );
  });
  it("contactToWhatsAppMessage memuat semua field", () => {
    const values: ContactValues = {
      name: "Budi",
      email: "budi@example.com",
      service: "Landing Page",
      subject: "Proyek",
      message: "Saya ingin membuat landing page.",
    };
    const msg = contactToWhatsAppMessage(values);
    expect(msg).toContain("Nama: Budi");
    expect(msg).toContain("Email: budi@example.com");
    expect(msg).toContain("Jenis Layanan: Landing Page");
    expect(msg).toContain("Subjek: Proyek");
    expect(msg).toContain("Saya ingin membuat landing page.");
  });
});
```

- [ ] **Step 2 — jalankan, pastikan gagal**: `npx vitest run lib/wa.test.ts` — FAIL (module not found)

- [ ] **Step 3 — implementasi minimal** (`lib/wa.ts`)

```ts
import { siteConfig } from "@/constants/site";
import type { ContactValues } from "@/lib/schemas/forms";

export function waNumber(): string {
  return siteConfig.socials.whatsapp.match(/wa\.me\/(\d+)/)?.[1] ?? "";
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${waNumber()}?text=${encodeURIComponent(message)}`;
}

export function contactToWhatsAppMessage(values: ContactValues): string {
  return [
    "Halo KantongIn, saya tertarik jasa pembuatan website!",
    "",
    `Nama: ${values.name}`,
    `Email: ${values.email}`,
    `Jenis Layanan: ${values.service}`,
    `Subjek: ${values.subject}`,
    `Pesan: ${values.message}`,
  ].join("\n");
}
```

- [ ] **Step 4 — jalankan, pastikan PASS**: `npx vitest run lib/wa.test.ts`

- [ ] **Step 5 — commit**: `test(wa): helper link WhatsApp prefilled` (git add lib/wa.ts lib/wa.test.ts)

---

### Task 2: Schema.org `ProfessionalService`

**Files:**
- Modify: `components/common/JsonLd.tsx`
- Create: `components/common/JsonLd.test.ts`

**Interfaces:**
- Produces: `buildOrganizationSchema(): Record<string, unknown>` (dipakai `JsonLd`)

- [ ] **Step 1 — tulis test gagal** (`components/common/JsonLd.test.ts`)

```ts
import { describe, expect, it } from "vitest";
import { buildOrganizationSchema } from "./JsonLd";

describe("buildOrganizationSchema", () => {
  it("bertipe Organization dan ProfessionalService", () => {
    const schema = buildOrganizationSchema();
    expect(schema["@type"]).toEqual(["Organization", "ProfessionalService"]);
  });
  it("memuat priceRange dan areaServed", () => {
    const { priceRange, areaServed } = buildOrganizationSchema();
    expect(priceRange).toBe("Rp 500 rb - custom");
    expect(areaServed).toBe("ID");
  });
  it("memuat contactPoint WhatsApp", () => {
    const contactPoint = buildOrganizationSchema().contactPoint as Record<string, unknown>;
    expect(contactPoint.telephone).toBe("+6285775149968");
    expect(contactPoint.contactType).toBe("sales");
  });
  it("tidak meng-emit email saat kosong", () => {
    expect(buildOrganizationSchema().email).toBeUndefined();
  });
  it("tidak memuat aggregateRating", () => {
    expect(buildOrganizationSchema().aggregateRating).toBeUndefined();
  });
});
```

- [ ] **Step 2 — jalankan, pastikan gagal**: `npx vitest run components/common/JsonLd.test.ts`

- [ ] **Step 3 — implementasi refactor** `JsonLd.tsx` sesuai rencana (export `buildOrganizationSchema`, `@type` array, `priceRange`, `contactPoint`, `areaServed`, `email` kondisional; `JsonLdFaq` tidak berubah).

- [ ] **Step 4 — PASS**: `npx vitest run components/common/JsonLd.test.ts`

- [ ] **Step 5 — commit**: `feat(seo): schema.org ProfessionalService untuk bisnis jasa`

---

### Task 3: Form kontak → WhatsApp

**Files:**
- Modify: `components/sections/ContactSection.tsx`
- Modify: `e2e/contact.spec.ts`

**Interfaces:**
- Consumes: `buildWhatsAppLink`, `contactToWhatsAppMessage` (Task 1)

- [ ] **Step 1 — tulis test e2e baru** (`e2e/contact.spec.ts`): validasi kosong dengan tombol "Kirim via WhatsApp" + test submit membuka WhatsApp via stub `window.open` (cek `wa.me/6285775149968?text=`).

- [ ] **Step 2 — implementasi** `ContactSection.tsx`: onSubmit sinkron → `window.open(buildWhatsAppLink(...))`, hapus state `status`/fetch/`Loader2`, tombol "Kirim via WhatsApp" + `SocialIcon`, pesan `role="status"`.

- [ ] **Step 3 — gate**: `npm run lint && npm test && npm run test:e2e` — hijau.

- [ ] **Step 4 — commit**: `feat(contact): form kontak membuka WhatsApp prefilled`

---

### Task 4: Footer — hapus newsletter → "Ikuti Kami"

**Files:**
- Modify: `components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `buildWhatsAppLink` (Task 1)

- [ ] **Step 1 — jalankan baseline e2e footer**: `npx playwright test e2e/home.spec.ts` (sebelum perubahan) — hijau.

- [ ] **Step 2 — implementasi**: hapus `NewsletterForm` + impor tak terpakai; kolom ke-4 → "Ikuti Kami" (Instagram, TikTok, WhatsApp prefilled); blok Sumber & Legal tetap.

- [ ] **Step 3 — gate**: `npm run lint && npm test && npm run test:e2e` — hijau.

- [ ] **Step 4 — commit**: `feat(footer): ganti newsletter dengan blok Ikuti Kami`

---

### Task 5: Label ilustrasi 4 seksi

**Files:**
- Modify: `components/sections/Portfolio.tsx` + `Portfolio.test.tsx`
- Modify: `components/sections/Testimonials.tsx` + `Testimonials.test.tsx`
- Modify: `components/sections/TrustedBy.tsx` + `TrustedBy.test.tsx`
- Modify: `components/sections/ContactSection.tsx`, Create `components/sections/ContactSection.test.tsx`

Teks label (gaya `text-sm text-muted`, rata tengah untuk seksi ber-heading):
- Portfolio: `Catatan: contoh proyek ini ilustratif dan akan diperbarui saat klien nyata tayang.`
- Testimonials: `Testimoni ilustratif - akan diisi saat klien nyata tayang.`
- TrustedBy: `Nama partner ilustratif.`
- ContactSection (kolom kiri): `Contoh proyek & testimoni di halaman ini bersifat ilustratif.`

- [ ] **Step 1 — tulis assertion per seksi** (render + `getByText(/.../i)`)
- [ ] **Step 2 — jalankan, pastikan gagal**: `npm test`
- [ ] **Step 3 — implementasi label** di 4 seksi
- [ ] **Step 4 — PASS**: `npm test`
- [ ] **Step 5 — commit**: `feat(content): tandai contoh proyek, testimoni, partner sebagai ilustrasi`

---

### Task 6: Dokumen, build, verifikasi manual

**Files:**
- Modify: `.env.example`
- Modify: `README.md`

- [ ] **Step 1 — `.env.example`**: komentar RESEND → "(opsional - hanya untuk beralih ke jalur email; kosong = WhatsApp aktif)".
- [ ] **Step 2 — README**: catatan form kontak → WhatsApp sampai email dikonfigurasi; tabel `RESEND_*` → opsional.
- [ ] **Step 3 — full CI**: `npm run lint && npm test && npm run build && npm run test:e2e` — semua hijau.
- [ ] **Step 4 — verifikasi browser** (dev server `localhost:3000`): label ilustrasi tampil; form → tab WhatsApp berisi pesan; float WhatsApp prefilled; footer "Ikuti Kami"; `curl` halaman → JSON-LD `ProfessionalService`/`priceRange`/`contactPoint`, tanpa `"email":""` & `aggregateRating`.
- [ ] **Step 5 — commit**: `docs: catat jalur WhatsApp & env email opsional`

---

### Handoff

Squash merge `feat/conversion-whatsapp` → `main`, hapus branch, push ke `origin/main` (Vercel auto-deploy).