# Rencana Implementasi: Batch 4 Portfolio + Testimonials

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membuat bukti hasil Portfolio selalu terlihat (chip persisten + indeks editorial + glow), dan menambah aksen editorial pada Testimonials (heading display + glyph kutip gradient).

**Architecture:** Bedah presisi dua komponen eksisting; tanpa perubahan struktur data (`constants/portfolio.ts`, `constants/testimonials.ts`), anchor section, maupun kontrak dialog/carousel.

**Tech Stack:** Next.js 16, Tailwind v4, Framer Motion, Embla Carousel, Vitest + Testing Library.

## Global Constraints

- Branch `feat/portfolio-testimonials` dari `main`; commit konvensional bahasa Indonesia imperatif.
- Node 22 wajib (`export PATH="$HOME/.nvm/versions/node/v22.23.2/bin:$PATH"`).
- Id section & landmark tidak berubah; E2E eksisting wajib tetap hijau tanpa modifikasi.
- Copy Bahasa Indonesia; animasi hormati `useReducedMotion`.

---

### Task 1: Portfolio Chip Persisten + Indeks Editorial

**Files:**
- Modify: `components/sections/Portfolio.tsx`
- Test: `components/sections/Portfolio.test.tsx` (create)

**Interfaces:**
- Consumes: `.glow-section` (globals.css), `projects`, `useLenis` (mock di test).
- Produces: kartu dengan chip hasil persisten (di luar overlay hover), ghost index `01`–`06`, section glow.

- [ ] **Step 1 — Test gagal** (`components/sections/Portfolio.test.tsx`):

```tsx
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { Portfolio } from "./Portfolio";
import { projects } from "@/constants/portfolio";

vi.mock("@/lib/lenis", () => ({
  useLenis: () => ({ scrollTo: vi.fn(), ready: true }),
}));

describe("Portfolio", () => {
  it("merender heading seksi dan filter kategori", () => {
    const { getByRole, getByText } = render(<Portfolio />);
    expect(
      getByRole("heading", { name: /Hasil Nyata, Kampanye Terukur/ })
    ).toBeInTheDocument();
    expect(getByText("Semua")).toBeInTheDocument();
  });

  it("hasil kampanye dirender sebagai chip persisten di luar overlay hover", () => {
    const { getByText } = render(<Portfolio />);
    const chip = getByText(projects[0].result);
    expect(chip.closest('[class*="md:opacity-0"]')).toBeNull();
    expect(chip.closest(".backdrop-blur-sm")).not.toBeNull();
  });

  it("indeks editorial dirender di tiap kartu", () => {
    const { getAllByText } = render(<Portfolio />);
    for (const idx of ["01", "03", "06"]) {
      expect(getAllByText(idx).length).toBeGreaterThan(0);
    }
  });

  it("membuka dialog detail berisi metrics saat tombol detail diklik", () => {
    const { getByLabelText, getByText } = render(<Portfolio />);
    fireEvent.click(getByLabelText(`Lihat detail proyek ${projects[0].title}`));
    expect(getByText(/jaringan affiliate kami meluncurkan promo/i)).toBeInTheDocument();
    expect(getByText("Rp 4,2 M")).toBeInTheDocument();
  });
});
```

Run: exit harus 1 (chip persisten & indeks belum ada).

- [ ] **Step 2 — Implementasi** (`components/sections/Portfolio.tsx`):
  - Section: `<section id="portfolio" className="glow-section relative scroll-mt-28 py-20 lg:py-24">`.
  - Di panel gradient `PortfolioCard`, tambah ghost index (stabil via `index` prop):

```tsx
<span
  aria-hidden="true"
  className="absolute right-4 top-3 select-none font-serif text-5xl font-bold leading-none text-white/25"
>
  {String(index + 1).padStart(2, "0")}
</span>
```

  - Hapus baris `<p ...>{project.result}</p>` dari overlay hover.
  - Setelah overlay div (agar stack di atasnya), tambah chip persisten:

```tsx
<div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
  <span className="inline-flex items-center rounded-full border border-white/30 bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
    {project.result}
  </span>
</div>
```

- [ ] **Step 3 — Verifikasi**: test PASS; lint PASS.
- [ ] **Step 4 — Commit**: `feat(portfolio): chip hasil persisten dan indeks editorial pada kartu`

---

### Task 2: Testimonials Aksen Editorial

**Files:**
- Modify: `components/sections/Testimonials.tsx`
- Test: `components/sections/Testimonials.test.tsx` (create)

**Interfaces:**
- Consumes: `SectionHeading size="display"`, `.text-gradient`; stub `ResizeObserver` untuk Embla di jsdom.

- [ ] **Step 1 — Test gagal** (`components/sections/Testimonials.test.tsx`):

```tsx
import { describe, expect, it, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import { Testimonials } from "./Testimonials";

beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

describe("Testimonials", () => {
  it("heading memakai tipografi display", () => {
    const { getByRole } = render(<Testimonials />);
    const heading = getByRole("heading", { name: /Kata Mereka Tentang KantongIn/ });
    expect(heading.className).toContain("clamp");
  });

  it("glyph kutip dekoratif memakai text-gradient", () => {
    const { container } = render(<Testimonials />);
    const glyph = container.querySelector(".text-gradient");
    expect(glyph).not.toBeNull();
    expect(glyph?.getAttribute("aria-hidden")).toBe("true");
  });

  it("deskripsi seksi memakai copy baru", () => {
    const { getByText } = render(<Testimonials />);
    expect(getByText(/Bukan janji manis/i)).toBeInTheDocument();
  });
});
```

Run: exit harus 1.

- [ ] **Step 2 — Implementasi** (`components/sections/Testimonials.tsx`):
  - Heading → `size="display"`; deskripsi baru:
    `"Bukan janji manis — dengar langsung dari founder, brand, dan kreator yang bertumbuh bersama KantongIn."`
  - Ganti badge ikon Quote (span lingkaran) dengan glyph editorial:

```tsx
<span
  aria-hidden="true"
  className="text-gradient select-none font-serif text-6xl leading-none"
>
  &ldquo;
</span>
```

  - Import `Quote` dari lucide-react dihapus bila tak terpakai lagi.

- [ ] **Step 3 — Verifikasi**: test PASS; lint PASS.
- [ ] **Step 4 — Commit**: `feat(testimonials): heading display dan glyph kutip editorial`

---

### Task 3: Gerbang Akhir + Merge

- [ ] **Step 1 — Gate penuh**: lint, test (53+7 baru), build, e2e — semua exit 0.
- [ ] **Step 2 — Lighthouse median 3 sampel** vs baseline main (perf median 74 / a11y 96).
- [ ] **Step 3 — Squash merge + push**:

```bash
git checkout main && git merge --squash feat/portfolio-testimonials
git commit -m "feat(sections): portfolio chip hasil persisten dan testimonials aksen editorial batch 4"
git push origin main
```
