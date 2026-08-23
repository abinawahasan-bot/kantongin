# Rencana Implementasi: Batch 2 TrustedBy + Statistics

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade seksi TrustedBy (pill chip + fade edge) dan Statistics (editorial + featured stat Rp 2,5M) serta memperbaiki marquee saat reduced-motion, sesuai spec `docs/superpowers/specs/2026-08-24-batch2-trusted-statistics-design.md`.

**Architecture:** Konsumsi primitif Fase 0 (`GlowCard`, `.text-gradient`, `.glow-section`, `SectionHeading`) pada dua seksi; tambahan utility CSS `.marquee-fade` dan fix a11y marquee reduced-motion. Tanpa dependensi baru.

**Tech Stack:** Next.js 16, Tailwind v4, Framer Motion (eksisting), Vitest + Testing Library.

## Global Constraints

- Branch `feat/trusted-statistics` dari `main`; commit konvensional bahasa Indonesia imperatif.
- Node 22 wajib (`source ~/.nvm/nvm.sh && nvm use`).
- Copy Bahasa Indonesia; data angka tetap dari `constants/stats.ts`.
- Gerbang akhir: lint + test + build + e2e + Lighthouse median vs baseline main.
- Hindari pipe yang menelan exit code pada langkah verifikasi (`cmd > log 2>&1; echo $?`).

---

### Task 1: Utility `.marquee-fade` + Fix Reduced-Motion Marquee

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1 — Tambahkan** setelah blok `.group:hover .marquee-track`:

```css
.marquee-fade {
  mask-image: linear-gradient(
    to right,
    transparent,
    black 12%,
    black 88%,
    transparent
  );
}
```

- [ ] **Step 2 — Fix a11y**: ubah blok `@media (prefers-reduced-motion: reduce)` menjadi:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-blob-drift,
  .hero-mesh,
  .marquee-track {
    animation: none;
  }
}
```

- [ ] **Step 3 — Verifikasi**: `npm run build > /tmp/opencode/b2-build.log 2>&1; echo "build exit: $?"` → exit 0.
- [ ] **Step 4 — Commit**: `feat(ui): tambah marquee-fade dan hentikan marquee saat reduced-motion`

---

### Task 2: TrustedBy Pill Chip + Fade + Eyebrow

**Files:**
- Modify: `components/sections/TrustedBy.tsx`
- Test: `components/sections/TrustedBy.test.tsx` (create)

**Interfaces:**
- Consumes: `Marquee`, `partners`, `cn` (eksisting); class `.marquee-fade` dari Task 1.
- Produces: markup chip pill per partner; wrapper marquee dengan fade; label eyebrow uppercase.

- [ ] **Step 1 — Test gagal** (`components/sections/TrustedBy.test.tsx`):

```tsx
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TrustedBy } from "./TrustedBy";

describe("TrustedBy", () => {
  it("merender semua partner sebagai chip pill berborder", () => {
    const { getByText } = render(<TrustedBy />);
    const chip = getByText("Nusagro").closest("span")?.parentElement;
    expect(chip).toHaveClass("rounded-full", "border");
  });

  it("wrapper marquee memakai fade mask", () => {
    const { container } = render(<TrustedBy />);
    expect(container.querySelector(".marquee-fade")).not.toBeNull();
  });

  it("label eyebrow dirender", () => {
    const { getByText } = render(<TrustedBy />);
    expect(getByText(/Dipercaya oleh/i)).toBeInTheDocument();
  });
});
```

Run: `npm test -- components/sections/TrustedBy.test.tsx > /tmp/opencode/b2-tb-red.log 2>&1; echo "exit: $?"` → exit 1 (chip belum ada).

Catatan struktur: `PartnerWordmark` merender `<span>` luar (flex) berisi dot opsional + `<span>` teks. Asersi `closest("span").parentElement` menunjuk span luar — pastikan kelas pill diletakkan di span luar.

- [ ] **Step 2 — Implementasi**:
  - `PartnerWordmark`: pindahkan kelas pill ke span luar:

```tsx
return (
  <span className="flex shrink-0 items-center rounded-full border border-border bg-surface px-5 py-2.5 transition-colors duration-300 group-hover:border-primary/40">
    {withDot ? (
      <span aria-hidden="true" className="mr-3 size-2 rounded-full bg-primary" />
    ) : null}
    <span
      className={cn(
        "whitespace-nowrap text-xl text-muted transition-colors duration-300 group-hover:text-foreground",
        style
      )}
    >
      {name}
    </span>
  </span>
);
```

  - Label atas:

```tsx
<div className="flex items-center justify-center gap-4">
  <span aria-hidden="true" className="h-px w-10 bg-primary" />
  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
    Dipercaya oleh brand &amp; UMKM ternama
  </p>
  <span aria-hidden="true" className="h-px w-10 bg-primary" />
</div>
```

  - Wrapper kedua Marquee diberi fade:

```tsx
<div className="mt-12 space-y-6">
  <Marquee className="marquee-fade" duration={36}>…</Marquee>
  <Marquee className="marquee-fade" reverse duration={44}>…</Marquee>
</div>
```

- [ ] **Step 3 — Verifikasi**: test PASS (exit 0).
- [ ] **Step 4 — Commit**: `feat(trusted): wordmark pill chip dengan fade edge dan label eyebrow`

---

### Task 3: Statistics Rebuild Editorial

**Files:**
- Modify: `components/sections/Statistics.tsx`
- Test: `components/sections/Statistics.test.tsx` (create)

**Interfaces:**
- Consumes: `Counter`, `SectionHeading`, `GlowCard`, `stats` (dari `constants/stats.ts`: indeks 4 = 2.5/Rp M komisi), class `.text-gradient`, `.glow-section`.
- Produces: seksi dengan h2 baru, featured stat dalam GlowCard, baris divider 4 statistik.

- [ ] **Step 1 — Test gagal** (`components/sections/Statistics.test.tsx`):

```tsx
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Statistics } from "./Statistics";

describe("Statistics", () => {
  it("merender heading seksi", () => {
    const { getByRole } = render(<Statistics />);
    expect(
      getByRole("heading", { name: /Hasil Nyata, Bukan Janji/ })
    ).toBeInTheDocument();
  });

  it("merender kelima nilai statistik", () => {
    const { getAllByText } = render(<Statistics />);
    for (const suffix of ["+", "rb"]) {
      expect(getAllByText(new RegExp(suffix)).length).toBeGreaterThan(0);
    }
  });

  it("featured stat memakai glow card dan gradient", () => {
    const { getByText } = render(<Statistics />);
    const featuredValue = getByText(/Komisi Disalurkan/).closest("div");
    expect(featuredValue?.querySelector(".text-gradient")).not.toBeNull();
  });
});
```

Run → exit 1 (heading belum ada).

Catatan: Counter menganimasikan dari 0 sehingga angka final tidak langsung ada di DOM jsdom; asersi memakai label statis ("Komisi Disalurkan", suffix pada label "Affiliates Aktif" dsb.), bukan angka animasi.

- [ ] **Step 2 — Implementasi** (`components/sections/Statistics.tsx` full rewrite):

```tsx
import { Counter } from "@/components/common/Counter";
import { GlowCard } from "@/components/common/GlowCard";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { stats } from "@/constants/stats";

const FEATURED = stats[4];
const REST = stats.slice(0, 4);

export function Statistics() {
  return (
    <section id="statistics" className="glow-section py-20 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="KantongIn dalam Angka"
          title="Hasil Nyata, Bukan Janji"
          description="Angka yang terus tumbuh dari kampanye affiliate, endorsement, dan kolaborasi kreator yang kami jalankan."
        />

        <Reveal delay={0.05} className="mt-12">
          <GlowCard className="rounded-2xl">
            <div className="flex flex-col gap-6 px-8 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Komisi Disalurkan
                </p>
                <p className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">
                  <Counter
                    to={FEATURED.value}
                    suffix={FEATURED.suffix}
                    decimals={FEATURED.decimals}
                    className="text-gradient"
                  />
                </p>
              </div>
              <p className="max-w-sm text-base leading-relaxed text-muted">
                Total komisi yang sudah kami salurkan ke para kreator dari seluruh
                kampanye — bukti model bayar-performanya benar-benar bekerja.
              </p>
            </div>
          </GlowCard>
        </Reveal>

        <dl className="mt-6 grid grid-cols-2 divide-border border-t border-border md:grid-cols-4 md:divide-x">
          {REST.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={0.08 * (index + 1)}
              className="border-b border-border px-6 py-8 md:border-b-0"
            >
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="mt-2 text-4xl font-bold tracking-tight text-foreground lg:text-[2.75rem]">
                <Counter to={stat.value} suffix={stat.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
```

Catatan implementasi:
- `dt` sebelum `dd` di JSX agar urutan dokumen benar untuk a11y.
- Divider mobile: semua item `border-b`; di `md:` garis bawah dihapus dan pemisah vertikal via `md:divide-x`.

- [ ] **Step 3 — Verifikasi**: `npm test -- components/sections/Statistics.test.tsx` → PASS; sesuaikan asersi bila struktur div berbeda (featured: cari `.text-gradient` di dalam GlowCard).
- [ ] **Step 4 — Commit**: `feat(statistics): rebuild editorial dengan featured stat dan divider row`

---

### Task 4: Gerbang Akhir + Merge

- [ ] **Step 1 — Gate penuh**:

```bash
npm run lint > /tmp/opencode/b2-lint.log 2>&1; echo "lint: $?"
npm test > /tmp/opencode/b2-test.log 2>&1; echo "test: $?"
npm run build > /tmp/opencode/b2-build.log 2>&1; echo "build: $?"
npm run test:e2e > /tmp/opencode/b2-e2e.log 2>&1; echo "e2e: $?"
```

Semua harus exit 0 (unit 42+baru, e2e 11).

- [ ] **Step 2 — Lighthouse median 3 sampel** (metode pilot, `CHROME_PATH` Playwright chromium) vs baseline main → perf tidak turun signifikan.
- [ ] **Step 3 — Squash merge**:

```bash
git checkout main && git merge --squash feat/trusted-statistics
git commit -m "feat(sections): upgrade trustedby chip premium dan statistics editorial"
```
