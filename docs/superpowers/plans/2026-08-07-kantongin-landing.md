# KantongIn Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun landing page single-page premium untuk KantongIn (Digital Marketing & Creator Collaboration Agency) di `/home/corvusjpg/kantongin` dengan Next.js 15, konten Bahasa Indonesia, dan semua animasi sesuai prompt.

**Architecture:** App Router, seluruh section sebagai komponen independen di `components/sections/`, data konten dipisah ke `constants/`, reusable UI di `components/ui/` (shadcn), shared effects di `components/common/`, hooks di `hooks/`. Single-page — semua navbar link berupa anchor. Dark mode via `next-themes` + CSS variables.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui, Framer Motion, GSAP (ScrollTrigger), Lenis, Lucide React, React Hook Form + Zod, Embla Carousel, next-themes, CVA, clsx + tailwind-merge.

## Global Constraints

- Node >=18.18 (env: v18.19.1). Package manager: `npm`.
- Project root: `/home/corvusjpg/kantongin`. Git di main (disetujui user).
- Bahasa Indonesia untuk seluruh konten UI. Brand: "KantongIn".
- Next.js **15** (App Router) + React 19 + TypeScript strict + Tailwind **v4**.
- Struktur folder tanpa `src/` (sesuai prompt): `app/`, `components/{ui,layout,sections,common}/`, `hooks/`, `lib/`, `utils/`, `types/`, `constants/`, `styles/`, `animations/`, `public/`.
- Single-page landing; link navbar: `#home #services #portfolio #affiliate #creators #pricing #faq #contact` → semua anchor di halaman.
- Font: Plus Jakarta Sans (`next/font/google`), fallback Manrope.
- Color system (default light, varian dark): primary `#22C55E`, secondary `#0F172A`, accent `#3B82F6`, bg `#FFFFFF`, dark `#020617`, surface `#F8FAFC`, text `#111827`, muted `#64748B`, border `#E2E8F0`.
- Animasi penuh (particles, parallax, GSAP, Framer Motion) **tetap diimplementasikan**; target Lighthouse realistis ~85-90.
- Konten & aset: placeholder premium buatan sendiri (logo teks, mockup SVG, testimonial fiksi).
- Setiap task berakhir dengan `npm run lint`, `npm run build` hijau, dan commit.

---

## Task 1: Scaffold Next.js 15 + Dependency Setup

**Files:**
- Create: seluruh proyek di `/home/corvusjpg/kantongin`
- Modify: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `postcss.config.mjs`, `package.json`

- [x] **Step 1: Scaffold**

```bash
mkdir -p /home/corvusjpg/kantongin
npx create-next-app@15 . --typescript --tailwind --eslint --app --import-alias "@/*" --use-npm
```

DONE — Next 15.5.22, React 19.1.0. Git di-init manual (create-next-app tidak meng-init). Tailwind di-pin `~4.1.18` karena Tailwind 4.2+ butuh Node >=20; 4.1.x tetap Tailwind v4.

- [x] **Step 2: Install dependencies**

`framer-motion gsap lenis embla-carousel-react embla-carousel-autoplay next-themes react-hook-form zod @hookform/resolvers lucide-react clsx tailwind-merge class-variance-authority` — DONE.

- [x] **Step 3: Pastikan Tailwind v4** — DONE (tailwindcss `~4.1.18`, `@tailwindcss/postcss` `~4.1.18`; `postcss.config.mjs` memakai `@tailwindcss/postcss`).

- [x] **Step 4: Bersihkan boilerplate** — DONE. `app/globals.css` berisi `@import "tailwindcss";` + `@custom-variant dark`. Folder `.gitkeep` dibuat: `components/ui components/layout components/sections components/common hooks lib utils types constants styles animations`.

- [x] **Step 5: Verify + commit** — `npm run build` PASS (Turbopack), `npm run lint` PASS. Commit `a30e667 chore: scaffold Next.js 15 + deps for KantongIn landing`.

---

## Task 2: Design Tokens, Fonts, Theme System

**Files:**
- Create: `styles/theme.css`, `lib/theme.ts` (types token)
- Modify: `app/globals.css`, `app/layout.tsx`, `tailwind.config.ts` (jika ada / hapus), `components.json`

- [ ] **Step 1: CSS design tokens** — `app/globals.css`

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --primary: #22C55E;
  --secondary: #0F172A;
  --accent: #3B82F6;
  --background: #FFFFFF;
  --foreground: #111827;
  --surface: #F8FAFC;
  --muted: #64748B;
  --border: #E2E8F0;
  --radius: 0.75rem;
}
.dark {
  --background: #020617;
  --foreground: #F8FAFC;
  --surface: #0B1220;
  --muted: #94A3B8;
  --border: #1E293B;
}

@theme inline {
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-accent: var(--accent);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --font-sans: var(--font-plus-jakarta), "Manrope", ui-sans-serif, system-ui, sans-serif;
}
```
Tambahkan: `html { scroll-behavior: smooth; }` (Lenis akan override via CSS `html.lenis`), `body { @apply bg-background text-foreground antialiased; }`, focus-visible ring, `::selection` warna primary.

- [ ] **Step 2: Fonts + html props** — `app/layout.tsx`

```tsx
import { Plus_Jakarta_Sans } from "next/font/google";
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"], variable: "--font-plus-jakarta", display: "swap",
});
<html lang="id" suppressHydrationWarning className={plusJakarta.variable}>
```

- [ ] **Step 3: shadcn init (Tailwind v4)**

```bash
npx shadcn@latest init -y -b neutral --yes
npx shadcn@latest add button badge card accordion dialog avatar separator input label textarea skeleton
```
Expected: `components.json`, `components/ui/*`, `lib/utils.ts` (`cn`) dibuat.

- [ ] **Step 4: Verify + commit**

Run: `npm run build`. PASS. Commit: `feat: add design tokens, fonts, theme system, shadcn base`.

---

## Task 3: Providers & Global Hooks

**Files:**
- Create: `components/common/Providers.tsx`, `hooks/use-mounted.ts`, `hooks/use-mouse-position.ts`, `hooks/use-media-query.ts`, `hooks/use-in-view.ts`, `lib/lenis.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: ThemeProvider + Lenis** — `components/common/Providers.tsx`

```tsx
"use client";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { LenisProvider } from "@/lib/lenis";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <LenisProvider>{children}</LenisProvider>
    </ThemeProvider>
  );
}
```
`lib/lenis.ts` membuat `LenisProvider` (client) yang instantiate `new Lenis({ lerp: 0.1, smoothWheel: true })`, menjalankan rAF loop `requestAnimationFrame(raf)`, dan expose context `{ scrollTo: (target) => lenis.scrollTo(target, { offset: -80 }) }`.

- [ ] **Step 2: Hooks dasar** — `hooks/use-mounted.ts` (mengembalikan `mounted: boolean` setelah mount, untuk hydration-safe), `hooks/use-media-query.ts` (`useMediaQuery(query): boolean`), `hooks/use-mouse-position.ts` (`{ x, y }` normalized -1..1, desktop only), `hooks/use-in-view.ts` (membungkus `useInView` framer-motion dengan `once: true`).

- [ ] **Step 3: Wrap di layout** — bungkus `{children}` dengan `<Providers>` di `app/layout.tsx`, import `app/globals.css`.

- [ ] **Step 4: Verify + commit**

Run: `npm run build`. PASS. Commit: `feat: add providers (theme, lenis) and core hooks`.

---

## Task 4: Reusable UI & Common Components

**Files:**
- Create: `components/common/SectionHeading.tsx`, `components/common/MagneticButton.tsx`, `components/common/Reveal.tsx`, `components/common/GlowCard.tsx`, `components/common/Marquee.tsx`, `components/common/Counter.tsx`, `components/common/Particles.tsx`, `components/common/AnimatedText.tsx`, `constants/site.ts`
- Modify: `components/ui/button.tsx`

- [ ] **Step 1: Constants situs** — `constants/site.ts`

```ts
export const siteConfig = {
  name: "KantongIn",
  tagline: "Digital Marketing & Creator Collaboration Agency",
  description: "KantongIn menghubungkan brand, UMKM, startup, dan kreator untuk tumbuh lewat affiliate marketing, endorsement, dan kolaborasi.",
  url: "https://kantongin.com",
  email: "halo@kantongin.com",
  socials: { instagram: "#", tiktok: "#", linkedin: "#", youtube: "#", whatsapp: "#" },
} as const;
```

- [ ] **Step 2: `SectionHeading`** — props `{ eyebrow, title, description, align }`, title berupa `AnimatedText` (fade-up per kata via framer-motion), eyebrow dengan accent line.

- [ ] **Step 3: `MagneticButton`** — wrapper mousemove memberi translate ±12px pada child (desktop & `prefers-reduced-motion: no-preference` saja), plus ripple effect on click (span animasi scale dari titik klik).

- [ ] **Step 4: `Reveal`** — framer-motion `motion.div` dengan `initial={{opacity:0, y:24}}` `whileInView={{opacity:1, y:0}}` `viewport={{once:true}}`, prop `delay`. `GlowCard` — div dengan gradient border 1px (via pseudo-element masked) + `hover` glow + subtle tilt (rotasi ±3° mengikuti mouse, desktop only).

- [ ] **Step 5: `Marquee`** — konten di-duplikasi, CSS keyframes `translateX(-50%)` infinite, `animation-play-state: paused` saat `:hover`.

- [ ] **Step 6: `Counter`** — props `{ to, suffix?, decimals? }`, gunakan `useInView` + `animate` framer-motion untuk count-up saat visible.

- [ ] **Step 7: `Particles`** — canvas 2D, 40 partikel float dengan sin-wobble + drift, ukuran 1-2px, warna primary/accent alpha rendah, `requestAnimationFrame`, pause saat tab hidden & reduced-motion, `devicePixelRatio` clamp <=1.5.

- [ ] **Step 8: Extend `components/ui/button.tsx`** — tambahkan variant `"primary"` (bg primary, text secondary), `"outline"` (border), `"ghost"`, size `"lg"`, dan shadow halus; CVA di `utils/variants.ts` atau inline.

- [ ] **Step 9: Verify + commit**

Run: `npm run lint && npm run build`. PASS. Commit: `feat: add reusable common components and site constants`.

---

## Task 5: Global Features (Loading, Scroll Progress, Back-to-Top, Cursor Glow, Nav)

**Files:**
- Create: `components/common/LoadingScreen.tsx`, `components/common/ScrollProgress.tsx`, `components/common/BackToTop.tsx`, `components/common/CursorGlow.tsx`, `components/layout/Navbar.tsx`, `components/layout/MobileMenu.tsx`, `constants/navigation.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: `constants/navigation.ts`** — array item `{ label, href, mega }` untuk: Home `#home`, Services `#services`, Portfolio `#portfolio`, Affiliate `#affiliate`, Creators `#creators`, Pricing `#pricing`, Blog `#faq` (Blog diarahkan ke FAQ section dgn label "Blog"), Contact `#contact`. `mega` berisi 2 kolom untuk Services (Affiliate Marketing, Open Promotion, Endorsement/KOL, Brand Collaboration, Social Media Management, Digital Campaign Strategy, Content Production).

- [ ] **Step 2: `LoadingScreen`** — overlay fixed inset-0 bg-background dengan logo "KantongIn" + progress bar (0→100 simulated ~1.2s), `AnimatePresence` fade+slide-up exit. Render di `app/layout.tsx`, tampil hanya saat first load (state `mounted`).

- [ ] **Step 3: `ScrollProgress`** — fixed top bar, `scaleX` dari `useScroll().scrollYProgress` framer-motion, gradient primary→accent.

- [ ] **Step 4: `BackToTop`** — muncul saat `scrollY > 600` (framer `useScroll`), tombol circular dengan `lenis.scrollTo(0)`.

- [ ] **Step 5: `CursorGlow`** — div fixed 400px radial-gradient primary alpha 0.06, `motion` lerp mengikuti mouse (spring), `pointer-events-none`, desktop + no reduced-motion only.

- [ ] **Step 6: `Navbar`** — `useScroll` + `useMotionValueEvent` → transparent saat top, glassmorphism (`backdrop-blur`, bg-white/70 dark:bg-slate-950/70, border-b) saat scroll. Logo kiri (SVG tulisan), menu tengah (desktop), kanan `ThemeToggle` + CTA "Mulai Kampanye" (`MagneticButton`). Desktop: item dengan `mega` menampilkan dropdown (hover + keyboard `aria-haspopup="true"`). Mobile: tombol hamburger → `MobileMenu` full-screen animated (staggered link reveal) + tombol close.

- [ ] **Step 7: Verify + commit**

Run: `npm run lint && npm run build`. PASS. Commit: `feat: add global features (loading, progress, back-to-top, cursor, navbar)`.

---

## Task 6: Hero Section

**Files:**
- Create: `components/sections/Hero.tsx`, `components/sections/hero/DashboardMockup.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: `app/page.tsx`** — render `<Hero />` saja sementara (section lain menyusul).

- [ ] **Step 2: `Hero.tsx`** — `<section id="home" class="relative min-h-screen ...">`:
  - Background: `Particles` (abs, opacity 0.4), 2-3 blur blob (radial-gradient primary/accent, `animate-blob` keyframes drift, GPU-only), subtle animated gradient mesh (CSS conic/linear gradient halus, `background-size` pan). **Gradient halus, tidak mencolok.**
  - Grid layout `lg:grid-cols-2`, padding top untuk navbar.
  - Kiri: `AnimatedText` headline besar (clamp 3rem-5.5rem) — "Tumbuhkan Bisnismu Lewat Affiliate, Promosi & Kolaborasi Kreator." Sub-paragraph muted, dua CTA: "Mulai Kampanye" (primary, arrow icon) + "Gabung Affiliate" (outline). Trust chips kecil (24+ brand, 500+ kreator).
  - Kanan: `DashboardMockup` — SVG/div dashboard (card revenue chart, kolom kreator, badge promo) dengan `parallax` (mousemove rotateX/rotateY ±6° + `useTransform` per layer, depth berbeda), float animation, glow shadow.
  - Bottom: scroll indicator (mouse icon / chevron bounce).
  - GSAP entry timeline: headline words stagger y+opacity, mockup scale-from-0.95, `gsap.from` sekali di `useEffect`.

- [ ] **Step 3: Verify + commit**

Run: `npm run lint && npm run build`. PASS. Commit: `feat: add hero section with particles, parallax, dashboard mockup`.

---

## Task 7: Trusted By + Statistics

**Files:**
- Create: `components/sections/TrustedBy.tsx`, `components/sections/Statistics.tsx`, `constants/partners.ts`, `constants/stats.ts`

- [ ] **Step 1: `constants/partners.ts`** — 8 nama brand fiksi (tulisan bergaya logo, font/weight variatif): "Nusagro", "KopiKita", "Batista", "RumahMode", "TechFlow", "SembakoID", "MotoGaul", "HijauKita".

- [ ] **Step 2: `TrustedBy`** — "Dipercaya oleh brand & UMKM ternama" caption + `Marquee` dua baris berlawanan arah (CSS `direction: reverse`), pause on hover.

- [ ] **Step 3: `constants/stats.ts`** — `[{ value: 350, suffix: "+", label: "Kampanye Berjalan" }, { value: 120, suffix: "+", label: "Brand & UMKM" }, { value: 850, suffix: "+", label: "Kreator Bergabung" }, { value: 60, suffix: "rb", label: "Affiliates Aktif" }, { value: 2.5, suffix: "M", decimals: 1, label: "Rupiah Komisi Disalurkan" }]`.

- [ ] **Step 4: `Statistics`** — grid 3-5 kolom, setiap item `Counter` besar (font-bold, tabular-nums) + label muted; kartu dengan divider, reveal per item.

- [ ] **Step 5: Verify + commit**

Run: `npm run lint && npm run build`. PASS. Commit: `feat: add trusted-by marquee and animated statistics`.

---

## Task 8: Services Section

**Files:**
- Create: `components/sections/Services.tsx`, `constants/services.ts`

- [ ] **Step 1: `constants/services.ts`** — `[{ icon: "handshake", title: "Affiliate Marketing", description: "...", points: [...] }, ...]` untuk 7 layanan (Affiliate Marketing, Open Promotion, Endorsement/KOL, Brand Collaboration, Social Media Management, Digital Campaign Strategy, Content Production), ikon via Lucide name string yang dipetakan di component.

- [ ] **Step 2: `Services.tsx`** — `<section id="services">`: `SectionHeading` (eyebrow "Layanan", title "Solusi Lengkap untuk Tumbuh Bersama", description). **Semua 7 layanan tampil**: grid `lg:grid-cols-3` 6 kartu reguler + 1 kartu lebar penuh (kolom-3 / `lg:col-span-3`) "Butuh solusi custom?" sebagai CTA card dengan gradient halus. Setiap kartu: `GlowCard` + lift, ikon dalam rounded-square bg-primary/10, title, desc, tombol "Pelajari →" dengan animated underline. Reveal staggered.

- [ ] **Step 3: Verify + commit**

Run: `npm run lint && npm run build`. PASS. Commit: `feat: add services section with interactive cards`.

---

## Task 9: Why Choose Us

**Files:**
- Create: `components/sections/WhyChooseUs.tsx`, `constants/values.ts`

- [ ] **Step 1: `constants/values.ts`** — 4 item `{ icon, title, description }`: "Tim Kreator Terkurasi", "Data-Driven & Transparan", "Eksekusi Cepat & Andal", "Hasil yang Terukur".

- [ ] **Step 2: `WhyChooseUs.tsx`** — zig-zag layout: konten kiri/gambar-kanan berselang-seling per item (alternate `lg:order-*`). Gambar: gradient panel dekoratif dengan ikon besar + floating badge kecil. Setiap item `Reveal` dari sisi yang berlawanan (kiri → slide-right, kanan → slide-left). Tambah visual connector curve tipis (SVG path stroke dash, draw on scroll via framer `useInView`).

- [ ] **Step 3: Verify + commit**

Run: `npm run lint && npm run build`. PASS. Commit: `feat: add why-choose-us zig-zag section`.

---

## Task 10: How It Works

**Files:**
- Create: `components/sections/HowItWorks.tsx`, `constants/steps.ts`

- [ ] **Step 1: `constants/steps.ts`** — dua alur: `forBrands` (4 langkah: Konsultasi → Briefing & Strategi → Peluncuran Kampanye → Report & Optimasi) dan `forCreators` (4 langkah: Daftar & Verifikasi → Pilih Kolaborasi → Terbitkan Konten → Raih Komisi).

- [ ] **Step 2: `HowItWorks.tsx`** — `<section id="how-it-works">` dengan toggle tab (Brand / Kreator, `useState`). Timeline vertikal: dot ikon + kartu langkah, garis penghubung vertikal yang **animate on scroll** (GSAP `ScrollTrigger` scaleY scrub dari atas ke bawah). Tabs animated via `AnimatePresence mode="wait"` fade/slide. Beri `id="affiliate"` dan `id="creators"` pada panel masing-masing (target anchor navbar).

- [ ] **Step 3: Verify + commit**

Run: `npm run lint && npm run build`. PASS. Commit: `feat: add how-it-works timeline with tabs`.

---

## Task 11: Portfolio

**Files:**
- Create: `components/sections/Portfolio.tsx`, `constants/portfolio.ts`

- [ ] **Step 1: `constants/portfolio.ts`** — 6 proyek fiksi `{ id, title, category, result, gradient }`: kategori "Affiliate", "Endorsement", "Brand Collab", "Social Media", masing-masing dengan gradient hero (SVG/gradient panel sebagai placeholder gambar, tanpa image asli).

- [ ] **Step 2: `Portfolio.tsx`** — `<section id="portfolio">`: filter pills (Semua + kategori, aktif state). Masonry grid (`columns-1 sm:columns-2 lg:columns-3` dengan `break-inside-avoid`, atau CSS grid + `row-span` bervariasi). Kartu: gradient placeholder + overlay hover (blur + judul + hasil + tombol "Lihat Detail"), `AnimatePresence` untuk filter transisi. Klik → `Dialog` (shadcn) berisi detail proyek + hasil metric.

- [ ] **Step 3: Verify + commit**

Run: `npm run lint && npm run build`. PASS. Commit: `feat: add portfolio masonry grid with filter and modal`.

---

## Task 12: Testimonials

**Files:**
- Create: `components/sections/Testimonials.tsx`, `constants/testimonials.ts`

- [ ] **Step 1: `constants/testimonials.ts`** — 5 testimoni `{ quote, name, role, company, rating }`: founder UMKM, brand manager, kreator, affiliate, startup CMO.

- [ ] **Step 2: `Testimonials.tsx`** — Embla carousel (autoplay 4.5s, pause on hover), slide besar berisi quote (besar, italic ringan), 5 bintang (Lucide `Star` filled), avatar (gradient circle inisial, bukan image), nama + role + company. Progress indicator: bar per slide yang menebal saat aktif (timing autoplay), plus dots tombol + prev/next arrow. Arrow `aria-label`.

- [ ] **Step 3: Verify + commit**

Run: `npm run lint && npm run build`. PASS. Commit: `feat: add testimonials carousel with autoplay and progress`.

---

## Task 13: Pricing

**Files:**
- Create: `components/sections/Pricing.tsx`, `constants/pricing.ts`

- [ ] **Step 1: `constants/pricing.ts`** — `[{ name: "Starter", price: "Rp 1,5 jt/bln", features: [...], highlight: false }, { name: "Professional", price: "Rp 4,9 jt/bln", features: [...], highlight: true }, { name: "Enterprise", price: "Custom", features: [...], highlight: false }]`.

- [ ] **Step 2: `Pricing.tsx`** — `<section id="pricing">`: 3 kartu, kartu tengah `highlight` (border primary, badge "Paling Populer", scale-105, glow). Fitur list dengan check icon. CTA per kartu. Note bawah: "Butuh skala lebih besar? Hubungi tim kami →". Reveal staggered, hover lift.

- [ ] **Step 3: Verify + commit**

Run: `npm run lint && npm run build`. PASS. Commit: `feat: add pricing section with highlighted plan`.

---

## Task 14: CTA + FAQ

**Files:**
- Create: `components/sections/CTASection.tsx`, `components/sections/FAQ.tsx`, `constants/faqs.ts`

- [ ] **Step 1: `constants/faqs.ts`** — 6-7 Q&A seputar jasa KantongIn (format: "Bagaimana cara mulai kampanye?", "Apa itu affiliate marketing?", "Bagaimana komisi dibayar?", "Apakah cocok untuk UMKM?", "Bagaimana cara bergabung jadi kreator?", "Apakah ada kontrak jangka panjang?").

- [ ] **Step 2: `CTASection.tsx`** — panel full-width dengan gradient halus (secondary→primary tint), headline besar "Siap Tumbuh Bersama KantongIn?", sub, tombol "Mulai Kampanye" + "Hubungi Kami" (MagneticButton). Background: `Particles` halus + blob.

- [ ] **Step 3: `FAQ.tsx`** — `<section id="faq">`: shadcn `Accordion` (type single), smooth height animation bawaan, plus `<input>` pencarian di atas (filter FAQ berdasarkan query, `useMemo`, "search-ready structure"). Chevron rotate, aria-expanded otomatis.

- [ ] **Step 4: Verify + commit**

Run: `npm run lint && npm run build`. PASS. Commit: `feat: add CTA section and searchable FAQ`.

---

## Task 15: Footer + Newsletter Form

**Files:**
- Create: `components/layout/Footer.tsx`, `components/sections/Newsletter.tsx` (di dalam Footer)

- [ ] **Step 1: `Footer.tsx`** — `<footer id="contact">`: 5 kolom — Perusahaan (tentang+logo), Layanan (link anchor), Resources (FAQ/Blog), Legal (placeholder link), Sosial (ikon). Newsletter form di atas kolom (atau kolom tersendiri): input email + tombol.

- [ ] **Step 2: Newsletter validation** — React Hook Form + Zod:

```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({ email: z.string().email("Email tidak valid") });
type FormValues = z.infer<typeof schema>;

const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
  useForm<FormValues>({ resolver: zodResolver(schema) });
```
Submit → state `subscribed=true` → tampilkan pesan sukses + note "// TODO: Integrasi dengan CMS/newsletter service". Bottom bar: copyright, "Dibuat dengan ❤️ di Indonesia", links Legal.

- [ ] **Step 3: Verify + commit**

Run: `npm run lint && npm run build`. PASS. Commit: `feat: add footer with newsletter form (RHF + Zod)`.

---

## Task 16: SEO, Metadata, Sitemap, Robots, JSON-LD

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `components/common/JsonLd.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: `app/layout.tsx` metadata**

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "KantongIn — Digital Marketing & Creator Collaboration", template: "%s | KantongIn" },
  description: siteConfig.description,
  keywords: ["affiliate marketing", "endorsement", "KOL", "digital marketing", "UMKM", "kreator"],
  openGraph: { type: "website", locale: "id_ID", url: siteConfig.url, siteName: siteConfig.name, title: "...", description: siteConfig.description, images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "...", description: siteConfig.description },
  robots: { index: true, follow: true },
};
```

- [ ] **Step 2: `JsonLd`** — component render `<script type="application/ld+json">` dengan `Organization` (nama, url, logo, sameAs socials) di layout, dan `FAQPage` (dari `constants/faqs.ts`) di `app/page.tsx`.

- [ ] **Step 3: `app/sitemap.ts`** — kembalikan `[{ url: siteConfig.url, lastModified, changeFrequency: "monthly", priority: 1 }]` (single-page).

- [ ] **Step 4: `app/robots.ts`** — `{ rules: [{ userAgent: "*", allow: "/" }], sitemap: `${siteConfig.url}/sitemap.xml` }`.

- [ ] **Step 5: `app/opengraph-image.tsx`** — `ImageResponse` (next/og) 1200×630: bg dark, teks "KantongIn" besar + tagline, dot primary. `runtime: "edge"` optional.

- [ ] **Step 6: Verify + commit**

Run: `npm run lint && npm run build`. PASS. Commit: `feat: add SEO metadata, sitemap, robots, OG image, JSON-LD`.

---

## Task 17: Assemble Page + Final QA

**Files:**
- Modify: `app/page.tsx`, `app/layout.tsx` (skip-link, main landmark)

- [ ] **Step 1: Assemble** — `app/page.tsx` render berurutan: `Hero → TrustedBy → Statistics → Services → WhyChooseUs → HowItWorks → Portfolio → Testimonials → Pricing → CTASection → FAQ`. Bungkus `<main id="main">`, tambah skip-link "Lewati ke konten" di `layout.tsx`.

- [ ] **Step 2: QA checklist (browser, `npm run dev`)** — dark/light toggle, mobile menu, semua anchor scroll (Lenis offset -80), loading screen sekali, tab keyboard reachable (tab-order, focus-visible), `aria-*` di carousel/accordion/dialog/menu, tidak ada layout shift saat font load, `prefers-reduced-motion` menonaktifkan particles/parallax/GSAP.

- [ ] **Step 3: Verify final** — `npm run lint` (0 error), `npm run build` (0 error).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: assemble landing page and final QA"
```

---

## Future Integration Points (komentar `// TODO:` di code)

- `lib/api.ts` — placeholder fetch untuk auth/dashboard (tidak diimplementasikan).
- `constants/*` — semua data siap diganti data CMS/database.
- Footer form — hook ke newsletter service.
- Navbar CTA — link ke flow autentikasi brand/kreator.

---

## Catatan & Tradeoff yang Disepakati

- **Semua animasi diimplementasikan** (particles, parallax, GSAP). Target Lighthouse realistis ~85-90 (particle canvas & Lenis menambah JS).
- Konten fiksi Bahasa Indonesia; mudah diganti karena terpusat di `constants/`.
- Logo placeholder berbasis teks + SVG.
