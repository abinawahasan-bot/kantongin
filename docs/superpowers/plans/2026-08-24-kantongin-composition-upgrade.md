# Rencana Implementasi: Upgrade Komposisi KantongIn (Fase 0 + Fase 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun fondasi desain (Fase 0) dan meng-upgrade seksi Hero sebagai pilot (Fase 1) sesuai spec `docs/superpowers/specs/2026-08-24-kantongin-composition-upgrade-design.md`.

**Architecture:** Penambahan primitif presentational tanpa dependensi baru: utility CSS gradient/glow di `app/globals.css`, prop `size` pada `SectionHeading`, komponen `BentoGrid` + `BentoItem`, dukungan `highlight` pada `AnimatedText`, dan komponen `KpiChip`. Pilot Hero merombak copy + integrasi visual dengan mempertahankan struktur section, anchor, dan aksesibilitas.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, Vitest + Testing Library, Playwright.

## Global Constraints

- Branch: Fase 0 = `feat/design-foundation` dari `main`; Fase 1 = `feat/hero-upgrade` dari `main` (setelah Fase 0 merge).
- Tanpa dependensi npm baru.
- Commit konvensional `<type>(<scope>): <deskripsi>` bahasa Indonesia imperatif.
- Semua animasi baru hormati `useReducedMotion()` dan pointer non-fine.
- Copy user-facing Bahasa Indonesia; sumber data angka tetap `constants/stats.ts`.
- Heading semantics dipertahankan: satu h1 per halaman, SectionHeading tetap h2.
- Gerbang verifikasi tiap fase: `npm run lint && npm test && npm run build && npm run test:e2e`.
- Node: gunakan Node 22 (`source ~/.nvm/nvm.sh && nvm use`) — Node 18 membuat Vitest gagal start.

---

### Task 1: Utility CSS `.text-gradient` & `.glow-section`

**Files:**
- Modify: `app/globals.css` (tambah blok setelah `.hero-mesh`, sebelum `@media prefers-reduced-motion`)

**Interfaces:**
- Produces: class CSS `.text-gradient` (gradient primary→accent pada teks) dan `.glow-section` (background glow radial halus, ::before absolute, pointer-events-none) untuk dikonsumsi Task 7 dan batch berikutnya.

- [ ] **Step 1 — Tambahkan utilitas** ke `app/globals.css` (letakkan tepat sebelum blok `@media (prefers-reduced-motion: reduce)`):

```css
.text-gradient {
  background-image: linear-gradient(100deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.glow-section {
  position: relative;
}

.glow-section::before {
  content: "";
  position: absolute;
  inset-inline: 0;
  top: 50%;
  height: 70%;
  transform: translateY(-50%);
  pointer-events: none;
  background: radial-gradient(
    60% 60% at 50% 50%,
    color-mix(in oklab, var(--primary) 7%, transparent),
    transparent 70%
  );
}
```

- [ ] **Step 2 — Verifikasi**: `npm run build` → PASS (CSS terkompilasi; belum ada konsumen).
- [ ] **Step 3 — Commit**:

```bash
git add app/globals.css
git commit -m "feat(ui): tambah utilitas text-gradient dan glow-section"
```

---

### Task 2: `SectionHeading` prop `size="display"`

**Files:**
- Modify: `components/common/SectionHeading.tsx`
- Test: `components/common/SectionHeading.test.tsx` (create)

**Interfaces:**
- Produces: `SectionHeadingProps.size?: "default" | "display"` — default perilaku lama persis; `"display"` menerapkan tipografi besar clamp pada h2 (`text-[clamp(2rem,5vw,3.25rem)] leading-[1.05]`).

- [ ] **Step 1 — Test gagal** (`components/common/SectionHeading.test.tsx`), pola mengikuti `SocialIcon.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { SectionHeading } from "./SectionHeading";

describe("SectionHeading", () => {
  it("ukuran default memakai kelas tipografi standar", () => {
    const { container } = render(<SectionHeading title="Judul Seksi" />);
    const heading = container.querySelector("h2");
    expect(heading).toHaveClass("text-3xl");
    expect(heading?.className).not.toContain("clamp");
  });

  it("size display memakai tipografi besar", () => {
    const { container } = render(
      <SectionHeading title="Judul Besar" size="display" />
    );
    const heading = container.querySelector("h2");
    expect(heading?.className).toContain("clamp");
    expect(heading).toHaveClass("leading-[1.05]");
  });
});
```

Run: `npm test -- components/common/SectionHeading.test.tsx` → Expected: FAIL (prop `size` belum ada / TS error).

- [ ] **Step 2 — Implementasi**: ubah tipe props dan className h2:

```tsx
type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  size?: "default" | "display";
};
```

Di dalam komponen tambahkan:

```tsx
const sizeClasses =
  size === "display"
    ? "text-[clamp(2rem,5vw,3.25rem)] leading-[1.05]"
    : "text-3xl sm:text-4xl md:text-5xl";
```

ganti className `AnimatedText` menjadi:

```tsx
<AnimatedText
  as="h2"
  text={title}
  className={cn("font-bold tracking-tight text-foreground", sizeClasses)}
/>
```

- [ ] **Step 3 — Verifikasi**: `npm test -- components/common/SectionHeading.test.tsx` → PASS (2 test).
- [ ] **Step 4 — Commit**:

```bash
git add components/common/SectionHeading.tsx components/common/SectionHeading.test.tsx
git commit -m "feat(ui): dukung ukuran display pada SectionHeading"
```

---

### Task 3: `BentoGrid` + `BentoItem`

**Files:**
- Create: `components/common/BentoGrid.tsx`
- Test: `components/common/BentoGrid.test.tsx`

**Interfaces:**
- Produces:
  - `BentoGrid({ children, className? })` — server component, grid 6 kolom mulai `md`: `grid gap-4 md:grid-cols-6`.
  - `BentoItem({ children, span?, className? })` — `span: "half" | "third" | "wide" | "full"` (default `"half"`): `md:col-span-3 | md:col-span-2 | md:col-span-4 | md:col-span-6`; mobile selalu 1 kolom penuh.

- [ ] **Step 1 — Test gagal** (`components/common/BentoGrid.test.tsx`):

```tsx
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { BentoGrid, BentoItem } from "./BentoGrid";

describe("BentoGrid", () => {
  it("merender grid 6 kolom responsif", () => {
    const { container } = render(<BentoGrid>isi</BentoGrid>);
    expect(container.firstElementChild).toHaveClass("grid", "md:grid-cols-6");
  });
});

describe("BentoItem", () => {
  it("span default half = 3 kolom", () => {
    const { container } = render(<BentoItem>isi</BentoItem>);
    expect(container.firstElementChild).toHaveClass("md:col-span-3");
  });

  it.each([
    ["third", "md:col-span-2"],
    ["wide", "md:col-span-4"],
    ["full", "md:col-span-6"],
  ] as const)("span %s menerapkan %s", (span, expected) => {
    const { getByText } = render(<BentoItem span={span}>{span}</BentoItem>);
    expect(getByText(span)).toHaveClass(expected);
  });
});
```

Run: `npm test -- components/common/BentoGrid.test.tsx` → Expected: FAIL (modul belum ada).

- [ ] **Step 2 — Implementasi** (`components/common/BentoGrid.tsx`) — tanpa hooks, aman RSC:

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SPAN_CLASSES = {
  half: "md:col-span-3",
  third: "md:col-span-2",
  wide: "md:col-span-4",
  full: "md:col-span-6",
} as const;

type BentoItemSpan = keyof typeof SPAN_CLASSES;

type BentoGridProps = { children: ReactNode; className?: string };
type BentoItemProps = {
  children: ReactNode;
  span?: BentoItemSpan;
  className?: string;
};

export function BentoGrid({ children, className }: BentoGridProps) {
  return <div className={cn("grid gap-4 md:grid-cols-6", className)}>{children}</div>;
}

export function BentoItem({ children, span = "half", className }: BentoItemProps) {
  return (
    <div className={cn("min-w-0", SPAN_CLASSES[span], className)}>{children}</div>
  );
}
```

- [ ] **Step 3 — Verifikasi**: `npm test -- components/common/BentoGrid.test.tsx` → PASS.
- [ ] **Step 4 — Commit**:

```bash
git add components/common/BentoGrid.tsx components/common/BentoGrid.test.tsx
git commit -m "feat(ui): tambah primitif bento grid"
```

---

### Task 4: Gerbang Fase 0 + Merge

- [ ] **Step 1 — Gerbang penuh**: `npm run lint && npm test && npm run build && npm run test:e2e` → semua PASS (30 unit + 2 baru + 11 e2e; lint 0 error).
- [ ] **Step 2 — Squash merge**:

```bash
git checkout main && git merge --squash feat/design-foundation
git commit -m "feat(ui): fondasi desain premium (bento grid, text-gradient, glow-section, heading display)"
```

---

### Task 5: `AnimatedText` dukungan `highlight`

**Files:**
- Modify: `components/common/AnimatedText.tsx`
- Test: `components/common/AnimatedText.test.tsx` (create)

**Interfaces:**
- Produces: prop opsional `highlight?: string` pada `AnimatedTextProps` — frasa yang muncul verbatim di `text`; kata-kata dalam frasa tersebut diberi class `text-gradient`. Jika `highlight` kosong/tidak ditemukan, perilaku identik dengan semula.

- [ ] **Step 1 — Test gagal** (`components/common/AnimatedText.test.tsx`):

```tsx
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { AnimatedText } from "./AnimatedText";

describe("AnimatedText highlight", () => {
  it("memberi text-gradient hanya pada kata frasa highlight", () => {
    const { getByLabelText } = render(
      <div>
        <AnimatedText text="Tumbuhkan Penjualan Kreator Terkurasi" highlight="Kreator Terkurasi" />
      </div>
    );
    const root = getByLabelText("Tumbuhkan Penjualan Kreator Terkurasi");
    const words = Array.from(root.querySelectorAll<HTMLElement>("span[aria-hidden]"));
    const highlighted = words.filter((w) => w.textContent?.trim() !== "" && w.querySelector(".text-gradient") !== null);
    const plain = words.filter((w) => w.textContent?.trim() !== "" && w.querySelector(".text-gradient") === null);
    expect(highlighted.map((w) => w.textContent?.trim())).toEqual(["Kreator", "Terkurasi"]);
    expect(plain.length).toBeGreaterThan(0);
  });

  it("tanpa highlight tidak ada text-gradient", () => {
    const { container } = render(<AnimatedText text="Kalimat Biasa Saja" />);
    expect(container.querySelectorAll(".text-gradient")).toHaveLength(0);
  });
});
```

Run: `npm test -- components/common/AnimatedText.test.tsx` → Expected: FAIL (prop belum ada).

- [ ] **Step 2 — Implementasi** di `AnimatedText.tsx`:

Tambah prop dan hitung rentang kata ber-highlight:

```tsx
type AnimatedTextProps = {
  text: string;
  className?: string;
  delay?: number;
  as?: ElementType;
  highlight?: string;
};
```

Dalam fungsi komponen, sebelum render:

```tsx
const words = text.split(" ");
const highlightWords = highlight ? highlight.split(" ") : [];

function isHighlighted(index: number): boolean {
  if (highlightWords.length === 0) return false;
  for (let start = 0; start <= words.length - highlightWords.length; start += 1) {
    let match = true;
    for (let offset = 0; offset < highlightWords.length; offset += 1) {
      if (words[start + offset] !== highlightWords[offset]) {
        match = false;
        break;
      }
    }
    if (match) return index >= start && index < start + highlightWords.length;
  }
  return false;
}
```

Pada `motion.span` tiap kata ganti className:

```tsx
<motion.span
  className={cn("inline-block", isHighlighted(index) && "text-gradient")}
  ...
>
```

(`cn` sudah diimpor.)

- [ ] **Step 3 — Verifikasi**: `npm test -- components/common/AnimatedText.test.tsx` → PASS.
- [ ] **Step 4 — Commit**:

```bash
git add components/common/AnimatedText.tsx components/common/AnimatedText.test.tsx
git commit -m "feat(ui): dukung sorotan frasa pada AnimatedText"
```

---

### Task 6: `KpiChip`

**Files:**
- Create: `components/sections/hero/KpiChip.tsx`
- Test: `components/sections/hero/KpiChip.test.tsx`

**Interfaces:**
- Produces: `KpiChip({ value, label, className?, floatDelay? })` — client component kartu mini absolut (`absolute` via className dari pemakai), `pointer-events-none`, float loop y `[0,-8,0]` durasi 5s `repeat: Infinity` dengan delay `floatDelay ?? 0`, dinonaktifkan saat `useReducedMotion()`.

- [ ] **Step 1 — Test gagal** (`components/sections/hero/KpiChip.test.tsx`):

```tsx
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { KpiChip } from "./KpiChip";

describe("KpiChip", () => {
  it("merender nilai dan label serta tidak dapat di-hover/diklik", () => {
    const { getByText } = render(<KpiChip value="+214%" label="Rata-rata ROI" />);
    expect(getByText("+214%")).toBeInTheDocument();
    expect(getByText("Rata-rata ROI")).toBeInTheDocument();
    const chip = getByText("+214%").closest("div");
    expect(chip).toHaveClass("pointer-events-none");
  });
});
```

Run: `npm test -- components/sections/hero/KpiChip.test.tsx` → Expected: FAIL (modul belum ada).

- [ ] **Step 2 — Implementasi** (`components/sections/hero/KpiChip.tsx`):

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type KpiChipProps = {
  value: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  floatDelay?: number;
};

export function KpiChip({ value, label, icon, className, floatDelay = 0 }: KpiChipProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
      className={cn(
        "pointer-events-none absolute z-10 flex items-center gap-2.5 rounded-xl border border-border bg-card/90 px-3.5 py-2.5 shadow-sm backdrop-blur",
        className
      )}
    >
      {icon ? <span className="text-primary">{icon}</span> : null}
      <span>
        <span className="block text-sm font-bold leading-tight text-foreground">{value}</span>
        <span className="block text-xs leading-tight text-muted">{label}</span>
      </span>
    </motion.div>
  );
}
```

- [ ] **Step 3 — Verifikasi**: `npm test -- components/sections/hero/KpiChip.test.tsx` → PASS.
- [ ] **Step 4 — Commit**:

```bash
git add components/sections/hero/KpiChip.tsx components/sections/hero/KpiChip.test.tsx
git commit -m "feat(hero): tambah komponen KpiChip"
```

---

### Task 7: Pilot Hero — Copy + Visual

**Files:**
- Modify: `components/sections/Hero.tsx`
- Modify: `e2e/home.spec.ts:8` (regex H1)
- Test: `e2e/home.spec.ts` (update), unit eksisting wajib tetap hijau

**Interfaces:**
- Consumes: `AnimatedText highlight`, `KpiChip`, `stats` dari `@/constants/stats`.

**Keputusan copy final (disetujui user):**
- H1: `"Tumbuhkan Penjualan Lewat Kolaborasi Kreator Terkurasi"` + `highlight="Kreator Terkurasi"`
- Sub-H1: `"Affiliate marketing & endorsement berbasis performa — bayar sesuai hasil, bukan janji. KantongIn hubungkan brand Anda dengan 850+ kreator siap kampanye."`
- CTA primer: `"Mulai Kampanye Gratis"` · CTA sekunder: link-teks `"Lihat cara kerjanya ↓"` (anchor `#how-it-works`, gaya teks + panah, tanpa MagneticButton)
- Strip bukti sosial: 3 entri pertama `stats` dirender `${value}${suffix} ${label}` (`350+ Kampanye Berjalan`, `120+ Brand & UMKM`, `850+ Kreator Bergabung`)
- KPI chips: `<KpiChip value="+214%" label="Rata-rata ROI" className="left-0 top-10 hidden lg:flex" />` dan `<KpiChip value="2.5M+" label="Komisi Disalurkan" floatDelay={1.2} className="-right-2 bottom-12 hidden lg:flex" />`
- Tuning kontras: Particles `opacity-40`→`opacity-25`; blob pertama `bg-primary/20`→`bg-primary/15`

- [ ] **Step 1 — Update e2e H1 regex** (`e2e/home.spec.ts:8`):

```ts
await expect(
  page.getByRole("heading", { name: /Tumbuhkan Penjualan/ })
).toBeVisible();
```

Run: `npx playwright test e2e/home.spec.ts -g "memuat halaman"` → Expected: FAIL (copy belum diubah).

- [ ] **Step 2 — Implementasi Hero.tsx**:
  - Ganti `TRUST_CHIPS` menjadi turunan stats:

```tsx
import { stats } from "@/constants/stats";

const SOCIAL_PROOF = stats.slice(0, 3).map((stat) => ({
  value: `${stat.value}${stat.suffix}`,
  label: stat.label,
}));
```

  - H1:

```tsx
<AnimatedText
  as="h1"
  text="Tumbuhkan Penjualan Lewat Kolaborasi Kreator Terkurasi"
  highlight="Kreator Terkurasi"
  className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
/>
```

  - Sub-H1 & CTA sekunder:

```tsx
<p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
  Affiliate marketing &amp; endorsement berbasis performa — bayar sesuai hasil,
  bukan janji. KantongIn hubungkan brand Anda dengan 850+ kreator siap kampanye.
</p>

<div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
  <MagneticButton href="#contact" onClick={(event) => handleAnchor(event, "#contact")}>
    <Button asChild variant="primary" size="lg" className="rounded-full">
      <span className="gap-2">
        Mulai Kampanye Gratis
        <ArrowRight className="size-4" aria-hidden="true" />
      </span>
    </Button>
  </MagneticButton>
  <a
    href="#how-it-works"
    onClick={(event) => handleAnchor(event, "#how-it-works")}
    className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-primary"
  >
    Lihat cara kerjanya
    <ArrowDown className="size-4" aria-hidden="true" />
  </a>
</div>
```

  (`ArrowDown` ditambah ke import lucide-react.)
  - Strip sosial (ganti blok TRUST_CHIPS map):

```tsx
<ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
  {SOCIAL_PROOF.map((item) => (
    <li key={item.label} className="flex items-baseline gap-2">
      <span className="text-base font-bold text-foreground">{item.value}</span>
      <span className="text-sm text-muted">{item.label}</span>
    </li>
  ))}
</ul>
```

  - KPI chips: tambah `relative` pada `<div ref={mockupRef}>` lalu sisipkan dua `KpiChip` sebagai anaknya (setelah `<DashboardMockup />`).
  - Tuning opacity Particles/blob sesuai keputusan di atas.
  - Hapus konstanta `TRUST_CHIPS` lama dan import `cn` bila tak terpakai lagi (cek referensi lain di file).

- [ ] **Step 3 — Verifikasi**: `npm run lint && npm test` → PASS semua; `npm run build` → PASS.
- [ ] **Step 4 — E2E**: `npm run test:e2e` → PASS 11 test.
- [ ] **Step 5 — Commit**:

```bash
git add components/sections/Hero.tsx e2e/home.spec.ts
git commit -m "feat(hero): pilot upgrade hero — copy outcome-focused, kpi chips, strip bukti sosial"
```

---

### Task 8: Gerbang Akhir Fase 1 + Merge

- [ ] **Step 1 — Gerbang penuh**: `npm run lint && npm test && npm run build && npm run test:e2e && npm run lighthouse` → skor Lighthouse tidak lebih rendah signifikan dari baseline main.
- [ ] **Step 2 — Review visual manual** `npm run dev`: kontras teks, posisi chip tidak menutupi mockup, reduced-motion (emulasi) tanpa animasi float.
- [ ] **Step 3 — Squash merge**:

```bash
git checkout main && git merge --squash feat/hero-upgrade
git commit -m "feat(hero): upgrade pilot seksi hero (visual premium + copywriting konversi)"
```
