# Rencana Implementasi: Batch 3 Services + WhyChooseUs + HowItWorks

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah Services menjadi layout bento dengan kartu flagship, menerapkan heading display editorial pada WhyChooseUs, dan mempertajam copy HowItWorks.

**Architecture:** Konsumsi `BentoGrid`/`BentoItem` (Fase 0) pada Services; prop eksisting `SectionHeading align/size`; tanpa perubahan struktur data (`constants/services.ts`) maupun anchor.

**Tech Stack:** Next.js 16, Tailwind v4, Framer Motion, Vitest + Testing Library.

## Global Constraints

- Branch `feat/services-mid` dari `main`; commit konvensional bahasa Indonesia imperatif.
- Node 22 wajib; hindari pipe yang menelan exit code.
- Id section & landmark tidak berubah; E2E eksisting wajib tetap hijau tanpa modifikasi.
- Copy Bahasa Indonesia.

---

### Task 1: Services Bento

**Files:**
- Modify: `components/sections/Services.tsx`
- Test: `components/sections/Services.test.tsx` (create)

**Interfaces:**
- Consumes: `BentoGrid`, `BentoItem` (`span: "full" | "third"`), `GlowCard`, `Reveal`, `SectionHeading`, `services`.
- Produces: grid bento — kartu pertama full-width horizontal, 6 kartu third, CTA full-width; indeks `01`–`07` tiap kartu.

- [ ] **Step 1 — Test gagal** (`components/sections/Services.test.tsx`):

```tsx
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Services } from "./Services";

describe("Services", () => {
  it("merender heading baru", () => {
    const { getByRole } = render(<Services />);
    expect(
      getByRole("heading", { name: /Semua yang Brand Butuhkan/ })
    ).toBeInTheDocument();
  });

  it("merender ketujuh layanan dan kartu CTA custom", () => {
    const { getByText } = render(<Services />);
    expect(getByText("Affiliate Marketing")).toBeInTheDocument();
    expect(getByText("Content Production")).toBeInTheDocument();
    expect(getByText(/solusi yang lebih spesifik/i)).toBeInTheDocument();
  });

  it("kartu flagship memakai span penuh bento", () => {
    const { getAllByText } = render(<Services />);
    const flagshipTitle = getAllByText("Affiliate Marketing")[0];
    const spanWrapper = flagshipTitle.closest('[class*="md:col-span-6"]');
    expect(spanWrapper).not.toBeNull();
  });

  it("indeks editorial dirender di tiap kartu", () => {
    const { getAllByText } = render(<Services />);
    expect(getAllByText("01").length).toBeGreaterThan(0);
    expect(getAllByText("07").length).toBeGreaterThan(0);
  });
});
```

Run: exit harus 1 (heading & bento belum ada).

- [ ] **Step 2 — Implementasi** (`components/sections/Services.tsx`):
  - Ganti container grid dengan `BentoGrid className="mt-14"`.
  - Kartu pertama (`index === 0`): `BentoItem span="full"` + layout horizontal baru:

```tsx
function FlagshipCard({ service, onLearnMore }: Omit<ServiceCardProps, "index">) {
  const Icon = icons[service.icon];
  return (
    <Reveal className="h-full">
      <GlowCard className="h-full">
        <div className="flex flex-col gap-8 p-8 sm:flex-row sm:items-center sm:p-10">
          <span className="inline-flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {Icon ? <Icon className="size-8" aria-hidden="true" /> : null}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-3">
              <span aria-hidden="true" className="text-xs font-bold tracking-[0.2em] text-primary/60">01</span>
              <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{service.title}</h3>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{service.description}</p>
            {service.points ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {service.points.map((point) => (
                  <li key={point} className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
            <a href="#contact" onClick={onLearnMore} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              <span className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100">Pelajari</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </GlowCard>
    </Reveal>
  );
}
```

  - Kartu standar: tambahkan indeks di atas judul:

```tsx
<span aria-hidden="true" className="text-xs font-bold tracking-[0.2em] text-primary/50">
  {String(index + 1).padStart(2, "0")}
</span>
```

(letakkan sebelum icon badge; sesuaikan gap.)

  - Struktur render:

```tsx
<BentoGrid className="mt-14">
  <BentoItem span="full">
    <FlagshipCard service={services[0]} onLearnMore={(e) => handleAnchor(e, "#contact")} />
  </BentoItem>
  {services.slice(1).map((service, i) => (
    <BentoItem key={service.title} span="third">
      <ServiceCard service={service} index={i + 1} onLearnMore={(e) => handleAnchor(e, "#contact")} />
    </BentoItem>
  ))}
  <BentoItem span="full">
    <CustomCtaCard onNavigate={handleNavigate} />
  </BentoItem>
</BentoGrid>
```

  - Hapus kelas `sm:col-span-2 lg:col-span-3` dari Reveal CustomCtaCard (kini dibungkus BentoItem).
  - Heading baru:

```tsx
<SectionHeading
  eyebrow="Layanan"
  title="Semua yang Brand Butuhkan untuk Tumbuh"
  description="Affiliate, endorsement, hingga content production — satu mitra untuk seluruh mesin pertumbuhan digital brand-mu."
/>
```

- [ ] **Step 3 — Verifikasi**: test PASS; lint PASS.
- [ ] **Step 4 — Commit**: `feat(services): layout bento dengan kartu flagship dan indeks editorial`

---

### Task 2: WhyChooseUs Heading Display

**Files:**
- Modify: `components/sections/WhyChooseUs.tsx`
- Test: `components/sections/WhyChooseUs.test.tsx` (create)

- [ ] **Step 1 — Test gagal**:

```tsx
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { WhyChooseUs } from "./WhyChooseUs";

describe("WhyChooseUs", () => {
  it("heading memakai tipografi display", () => {
    const { getByRole } = render(<WhyChooseUs />);
    const heading = getByRole("heading", { name: /Mengapa Brand Memilih Kami/ });
    expect(heading.className).toContain("clamp");
  });
});
```

Run → exit 1.

- [ ] **Step 2 — Implementasi**: ganti pemanggilan SectionHeading:

```tsx
<SectionHeading
  align="left"
  size="display"
  eyebrow="Kenapa KantongIn"
  title="Mengapa Brand Memilih Kami"
  description="Sistem kolaborasi terkurasi yang transparan dan berorientasi hasil — bukan sekadar penghubung brand dan kreator."
/>
```

- [ ] **Step 3 — Verifikasi**: test PASS.
- [ ] **Step 4 — Commit**: `feat(why): heading display kiri untuk aksen editorial`

---

### Task 3: HowItWorks Copy Polish

**Files:**
- Modify: `components/sections/HowItWorks.tsx` (description SectionHeading saja)

- [ ] **Step 1 — Ganti deskripsi**:

```tsx
description="Pilih alur Anda — sebagai brand yang ingin bertumbuh atau kreator yang ingin menghasilkan. Sisanya kami pandu langkah demi langkah."
```

- [ ] **Step 2 — Verifikasi**: `npm run lint > log 2>&1; echo $?` → 0.
- [ ] **Step 3 — Commit**: `feat(how): pertajam deskripsi cara kerja`

---

### Task 4: Gerbang Akhir + Merge

- [ ] **Step 1 — Gate penuh**: lint, test (48+7 baru), build, e2e — semua exit 0.
- [ ] **Step 2 — Lighthouse median 3 sampel** vs baseline main (perf median baseline 68).
- [ ] **Step 3 — Squash merge**:

```bash
git checkout main && git merge --squash feat/services-mid
git commit -m "feat(sections): services bento dengan flagship card dan aksen editorial tengah halaman"
```
