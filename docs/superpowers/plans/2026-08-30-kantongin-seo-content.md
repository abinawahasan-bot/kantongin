# SEO & Konten — Kategori Blog, Related Posts, Halaman Layanan & Tentang Kami — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Meningkatkan SEO & konten situs KantongIn: kategori blog + halaman kategori, artikel terkait, OG image dinamis, dan halaman statis `/layanan` serta `/tentang-kami`.

**Architecture:** Semua rute statis di App Router (SSG via `generateStaticParams`, `dynamicParams=false`); logika murni (kategori, related, OG URL) di-module terpisah yang di-cover unit test; halaman statis diverifikasi via e2e sesuai konvensi repo.

**Tech Stack:** Next.js 15 (App Router), MDX (gray-matter), lucide-react, `next/og` (ImageResponse), vitest + jsdom, Playwright (port 3100).

## Global Constraints

- Branch: `feat/seo-content` (dari `main` @ `8e30482`); squash merge ke `main` + push setelah gate hijau.
- Semua perintah npm/npx pakai prefix: `source ~/.nvm/nvm.sh >/dev/null && nvm use >/dev/null 2>&1 && <cmd>` (node v22.23.2).
- Konten bahasa Indonesia tanpa emoji. Tidak menambah library baru.
- Home (`/`) dan `app/opengraph-image.tsx` default TIDAK diubah. Lead funnel tetap WhatsApp-first via `lib/wa.ts`.
- Penyesuaian terhadap spec: unit-test halaman `/layanan` & `/tentang-kami` diganti cakupan e2e (konvensi repo), logika murni di-cover unit.

---

### Task 1: Blog — field `category`, helper, halaman kategori, chip kartu

**Files:**
- Modify: `app/blog/_posts.ts` (tipe + skema + helper), `app/blog/_posts.test.ts`, `app/blog/page.tsx`, `app/blog/_posts/*.mdx` (3 file), `e2e/blog.spec.ts`
- Create: `app/blog/kategori/[slug]/page.tsx`

**Interfaces:**
- Consumes: `posts` (existing export dari `_posts.ts`).
- Produces: `categoryToSlug(category: string): string`, `getCategories(): string[]`, `getPostsByCategory(category: string): Post[]`; field `category` pada `PostFrontmatter`.

- [ ] **Step 1: Write the failing test** di `app/blog/_posts.test.ts` (tambahkan describe baru):

```ts
it("setiap post punya category non-kosong", () => {
  for (const post of posts) expect(post.category.trim()).toBeTruthy();
});
it("getCategories unik & terurut abjad", () => {
  const cats = getCategories();
  expect(new Set(cats).size).toBe(cats.length);
  expect([...cats].sort((a, b) => a.localeCompare(b))).toEqual(cats);
});
it("categoryToSlug menormalkan spasi & simbol", () => {
  expect(categoryToSlug("UMKM & Digital")).toBe("umkm-digital");
  expect(categoryToSlug("Jasa Website")).toBe("jasa-website");
});
it("getPostsByCategory memfilter sesuai kategori", () => {
  const filtered = getPostsByCategory("E-commerce");
  expect(filtered.every((p) => p.category === "E-commerce")).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails** — `npm test app/blog/_posts.test.ts` → FAIL.
- [ ] **Step 3: Write minimal implementation** di `_posts.ts`:

```ts
export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
};

export const postFrontmatterSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  author: z.string().trim().min(1),
  category: z.string().trim().min(1),
  tags: z.array(z.string()),
});

export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getCategories(): string[] {
  return [...new Set(posts.map((p) => p.category))].sort((a, b) => a.localeCompare(b));
}

export function getPostsByCategory(category: string): Post[] {
  return posts.filter((p) => p.category === category);
}
```

- [ ] **Step 4: Migrate frontmatter** — tambah `category` di 3 `.mdx`: `cara-memilih-jasa-pembuatan-website` → `"Jasa Website"`; `landing-page-vs-toko-online` → `"E-commerce"`; `pentingnya-website-untuk-umkm` → `"UMKM & Digital"`. Update test existing "5 field" → 6 field (termasuk `category`).
- [ ] **Step 5: Run & commit** — `npm test app/blog/_posts.test.ts` → PASS; commit `test(blog): kategori wajib, slugify & filter`.
- [ ] **Step 6: Write failing e2e** di `e2e/blog.spec.ts`:

```ts
test("halaman kategori menampilkan kartu artikel", async ({ page }) => {
  await page.goto("/blog/kategori/umkm-digital");
  await expect(page.getByRole("heading", { name: /UMKM & Digital/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Pentingnya Website untuk UMKM/i })).toBeVisible();
});
```

- [ ] **Step 7: Implement page** `app/blog/kategori/[slug]/page.tsx` — `dynamicParams = false`; `generateStaticParams()` dari `getCategories()`; lookup `getCategories().find(c => categoryToSlug(c) === slug)` → tak ada `notFound()`; header (label "Blog", judul, jumlah posting), grid kartu (reuse markup kartu blog index); `metadata.title = `${category} | Blog``.
- [ ] **Step 8: Category chip** di `app/blog/page.tsx` — kartu tampil chip kategori `<Link href={/blog/kategori/${categoryToSlug(post.category)}}>`; tag yang dikenal sebagai kategori jadi `<Link>` lain sebagai `<span>`.
- [ ] **Step 9: Run & commit** — `npx playwright test e2e/blog.spec.ts` → PASS; commit `feat(blog): halaman kategori & chip kategori`.

---

### Task 2: Blog — related posts + breadcrumb + tag link

**Files:**
- Create: `app/blog/related.ts`, `app/blog/related.test.ts`
- Modify: `app/blog/[slug]/page.tsx`, `e2e/blog.spec.ts`

**Interfaces:**
- Consumes: `Post` type dari `app/blog/_posts.ts`.
- Produces: `getRelatedPosts(posts: Post[], slug: string, limit = 3): Post[]`.

- [ ] **Step 1: Write the failing test** `app/blog/related.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Post } from "./_posts";
import { getRelatedPosts } from "./related";

const posts: Post[] = [
  { slug: "a", category: "X", tags: ["t1", "t2"], title: "A", description: "", date: "2026-08-01", author: "T" },
  { slug: "b", category: "X", tags: ["t1"], title: "B", description: "", date: "2026-08-02", author: "T" },
  { slug: "c", category: "Y", tags: ["t3"], title: "C", description: "", date: "2026-08-03", author: "T" },
  { slug: "d", category: "Y", tags: ["t3"], title: "D", description: "", date: "2026-08-04", author: "T" },
];

describe("getRelatedPosts", () => {
  it("kategori sama lebih diprioritaskan, exclude diri", () => {
    expect(getRelatedPosts(posts, "a").map((p) => p.slug)).toEqual(["b"]);
  });
  it("mengisi limit dengan posting terbaru lain", () => {
    expect(getRelatedPosts(posts, "c", 3).map((p) => p.slug)).toEqual(["d", "b", "a"]);
  });
  it("tidak pernah menyertakan diri sendiri", () => {
    expect(getRelatedPosts(posts, "a").some((p) => p.slug === "a")).toBe(false);
  });
  it("slug tak dikenal mengembalikan array kosong", () => {
    expect(getRelatedPosts(posts, "zzz")).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails** — `npm test app/blog/related.test.ts` → FAIL.
- [ ] **Step 3: Write minimal implementation** `app/blog/related.ts`:

```ts
import type { Post } from "./_posts";

function score(candidate: Post, target: Post): number {
  let s = 0;
  if (candidate.category === target.category) s += 2;
  s += Math.min(candidate.tags.filter((t) => target.tags.includes(t)).length, 2);
  return s;
}

export function getRelatedPosts(posts: Post[], slug: string, limit = 3): Post[] {
  const target = posts.find((p) => p.slug === slug);
  if (!target) return [];
  const scored = posts
    .filter((p) => p.slug !== slug)
    .map((post) => ({ post, score: score(post, target) }));
  const sorted = scored.sort(
    (a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date)
  );
  const picked = sorted.slice(0, limit).map((x) => x.post);
  return picked.length < limit
    ? [...picked, ...sorted.slice(limit).map((x) => x.post)].slice(0, limit)
    : picked;
}
```

- [ ] **Step 4: Run & commit** — PASS; commit `feat(blog): helper artikel terkait (kategori & tag)`.
- [ ] **Step 5: Write failing e2e** di `e2e/blog.spec.ts`:

```ts
test("detail artikel menampilkan artikel terkait", async ({ page }) => {
  await page.goto("/blog/cara-memilih-jasa-pembuatan-website");
  await expect(page.getByRole("heading", { name: "Artikel terkait" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Pentingnya Website untuk UMKM/i })).toBeVisible();
});
```

- [ ] **Step 6: Implement `[slug]/page.tsx`** — breadcrumb `Blog › <Link kategori> › <judul>` di atas header; blok `<section aria-labelledby="artikel-terkait">` berisi H2 "Artikel terkait" + grid 3 kartu padat (`post.slug`, judul, `line-clamp-2` description, tanggal); sembunyikan bila tak ada; tag detail jadi `<Link>` bila dikenal sebagai kategori.
- [ ] **Step 7: Run & commit** — `npx playwright test e2e/blog.spec.ts` → PASS; commit `feat(blog): artikel terkait & breadcrumb kategori`.

---

### Task 3: OG image dinamis

**Files:**
- Create: `lib/og.ts`, `lib/og.test.ts`, `app/og-image/route.tsx`, `e2e/seo-pages.spec.ts`
- Modify: `app/blog/page.tsx` (metadata), `app/blog/[slug]/page.tsx` (generateMetadata)

**Interfaces:**
- Produces: `buildOgImageUrl(title: string, subtitle?: string): string` → `/og-image?title=...&subtitle=...`.

- [ ] **Step 1: Write the failing test** `lib/og.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildOgImageUrl } from "./og";

describe("buildOgImageUrl", () => {
  it("mengencode title dan diawali /og-image?", () => {
    expect(buildOgImageUrl("Paket & Harga")).toBe("/og-image?title=Paket+%26+Harga");
  });
  it("menyertakan subtitle bila ada", () => {
    expect(buildOgImageUrl("A", "B C")).toBe("/og-image?title=A&subtitle=B+C");
  });
  it("tidak menyertakan subtitle bila kosong", () => {
    expect(buildOgImageUrl("A")).not.toContain("subtitle");
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npm test lib/og.test.ts` → FAIL.
- [ ] **Step 3: Write minimal implementation** `lib/og.ts` (lihat Interface).
- [ ] **Step 4: Implement route** `app/og-image/route.tsx` — `export const runtime = "nodejs"; export const size = { width: 1200, height: 630 }; export const contentType = "image/png";` GET baca `searchParams`; tanpa `title` → `new Response("Bad Request", { status: 400 })`; `ImageResponse` latar `#020617`, badge "KantongIn" (`#22C55E`), judul putih 64px auto-wrap, strip aksen kiri, subtitle `#94A3B8`.
- [ ] **Step 5: Run & commit** — `npm test lib/og.test.ts` → PASS; commit `feat(seo): OG image dinamis via /og-image`.
- [ ] **Step 6: Wire metadata** — blog index + detail `generateMetadata`: `openGraph.images` = `[{ url: buildOgImageUrl(<judul>, siteConfig.tagline), width: 1200, height: 630, alt: <judul> + " | KantongIn" }]`, `twitter.image` senada.
- [ ] **Step 7: Write e2e** `e2e/seo-pages.spec.ts` (baru):

```ts
import { test, expect } from "@playwright/test";

test("OG image dinamis merespons PNG", async ({ page }) => {
  const res = await page.request.get("/og-image?title=Halo%20Dunia");
  expect(res.status()).toBe(200);
  expect((await res.headers())["content-type"]).toContain("image/png");
});

test("OG image tanpa title mengembalikan 400", async ({ page }) => {
  expect((await page.request.get("/og-image")).status()).toBe(400);
});
```

- [ ] **Step 8: Run & commit** — `npx playwright test e2e/seo-pages.spec.ts` → PASS; commit `feat(seo): OG image pada metadata blog`.

---

### Task 4: Halaman /tentang-kami (+ `DataIcon`)

**Files:**
- Create: `components/common/DataIcon.tsx`, `components/common/DataIcon.test.tsx`, `app/tentang-kami/page.tsx`
- Modify: `e2e/seo-pages.spec.ts`

**Interfaces:**
- Produces: `DataIcon({ name: string; className?: string })` — server-safe, `null` untuk nama tak dikenal.

- [ ] **Step 1: Write the failing test** `DataIcon.test.tsx` — nama icon `values` (`badgeCheck`, `barChart`, `rocket`, `trendingUp`) dan `services` (`shoppingCart`, `layoutTemplate`, `building2`, `monitorSmartphone`, `wrench`) render `<svg>`; nama tak dikenal → anak kosong.
- [ ] **Step 2: Run to verify it fails** — `npm test components/common/DataIcon.test.tsx` → FAIL.
- [ ] **Step 3: Implement** `DataIcon.tsx` — map nama → komponen lucide (server-safe, tanpa `"use client"`), fallback `null`.
- [ ] **Step 4: Run & commit** — PASS; commit `feat(ui): komponen DataIcon untuk halaman statis`.
- [ ] **Step 5: Implement page** `app/tentang-kami/page.tsx` — metadata (`title: "Tentang Kami"`, OG `buildOgImageUrl("Tentang KantongIn", siteConfig.tagline)`), inline JSON-LD `AboutPage`; seksi intro (label, judul, narasi tagline, CTA `buildWhatsAppLink(WA_CHAT_MESSAGE)` + link `/layanan`), grid nilai (`values` + `DataIcon`), kartu stats (`Intl.NumberFormat("id-ID")` + `decimals`), partner (`partners`), 3 testimoni (`testimonials.slice(0, 3)`), CTA tutup. Pakai `GlowCard`, `SectionHeading`, `Reveal`.
- [ ] **Step 6: Write e2e** tambah di `seo-pages.spec.ts` — `/tentang-kami`: heading /Tentang KantongIn/, heading "Nilai-Nilai", link WhatsApp prefilled (`wa.me`).
- [ ] **Step 7: Run & commit** — `npx playwright test e2e/seo-pages.spec.ts` → PASS; commit `feat(pages): halaman tentang-kami`.

---

### Task 5: Halaman /layanan

**Files:**
- Create: `app/layanan/page.tsx`
- Modify: `e2e/seo-pages.spec.ts`

**Interfaces:**
- Consumes: `services` (`constants/services.ts`), `flows[0]` (`constants/steps.ts`), `faqs` (`constants/faqs.ts`), `JsonLdFaq` (`components/common/JsonLd.tsx`), `DataIcon`, `buildWhatsAppLink`.

- [ ] **Step 1: Implement page** `app/layanan/page.tsx` — metadata (`title: "Layanan"`, OG `buildOgImageUrl("Layanan Pembuatan Website", siteConfig.tagline)`). Seksi: intro + CTA WA; 6 blok layanan (`services`, `DataIcon`, `points` checked-list, link "Konsultasi layanan ini" → `buildWhatsAppLink(\`Halo KantongIn, saya ingin konsultasi ${service.title}.\`)`); cara kerja `flows[0].steps` bernomor; FAQ `faqs` via `<details>/<summary>` + `<JsonLdFaq />`; garansi + CTA tutup (`WA_CHAT_MESSAGE`) + link `/tentang-kami`.
- [ ] **Step 2: Write e2e** tambah di `seo-pages.spec.ts` — `/layanan`: heading "Semua Jenis Website yang Anda Butuhkan", seksi "Cara Kerja", `details` FAQ, link WhatsApp prefilled.
- [ ] **Step 3: Run & commit** — `npx playwright test e2e/seo-pages.spec.ts` → PASS; commit `feat(pages): halaman layanan dengan FAQ & CTA WhatsApp`.

---

### Task 6: Navigasi, sitemap, footer, README & gate penuh

**Files:**
- Modify: `constants/navigation.ts`, `components/layout/Footer.tsx`, `components/layout/Footer.test.tsx`, `app/sitemap.ts`, `README.md`

- [ ] **Step 1: navigation.ts** — mega "Layanan": prepend `{ label: "Lihat semua layanan", href: "/layanan" }`; tambah `{ label: "Tentang Kami", href: "/tentang-kami" }` setelah "Beranda".
- [ ] **Step 2: Footer.tsx** — kolom "Layanan" tambah link "Semua Layanan" → `/layanan` (`serviceLinks` jadi `{ label, href }[]`, link non-`#` tanpa `handleAnchor`); "Tentang Kami" otomatis muncul di kolom Navigasi. `Footer.test.tsx` tambah ekspektasi kedua link.
- [ ] **Step 3: sitemap.ts** — tambah `/layanan` (0.8 monthly), `/tentang-kami` (0.6 yearly), `/blog/kategori/<slug>` per `getCategories()` (0.6 weekly).
- [ ] **Step 4: README.md** — struktur proyek + fitur SEO/konten.
- [ ] **Step 5: Gate penuh** — `npm run lint` (0 error), `npm test` (hijau), `npm run build` (22 halaman statis: 17 + 3 kategori + layanan + tentang-kami), `npx playwright test` (hijau, ±17 test: home 6, contact 2, blog 5, seo 4).
- [ ] **Step 6: Commit** — `feat(nav): pintu masuk halaman layanan & tentang kami, sitemap luas`.

---

## Eksekusi

- Eksekusi inline per task dengan commit per task (pola Kelompok A).
- Setelah Task 6: gate penuh hijau → squash merge `feat/seo-content` ke `main`, hapus branch, push `origin/main`, verifikasi produksi (curl: halaman baru, OG route 200, sitemap).