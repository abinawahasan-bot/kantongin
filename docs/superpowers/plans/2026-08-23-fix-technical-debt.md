# Rencana Implementasi: Perbaikan Kelemahan Teknis KantongIn

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Memperbaiki 6 kelemahan teknis landing page KantongIn tanpa mengubah perilaku user-facing (kecuali penambahan halaman legal).

**Architecture:** Refactor terisolasi per-area pada Next.js 16 App Router: rate limiter hibrida (Upstash opsional + fallback in-memory), skema Zod bersama, blog fs-based dengan satu sumber kebenaran untuk listing/sitemap/render, dan halaman legal statis.

**Tech Stack:** Next.js 16 + Turbopack, Zod 4, gray-matter, next-mdx-remote (RSC), @upstash/redis + @upstash/rate-limiter, Vitest, Playwright.

## Global Constraints

- Branch kerja: `fix/technical-debt` dari `main`; merge squash kembali ke `main`.
- Commit konvensional: `<type>(<scope>): <deskripsi>` dalam bahasa Indonesia, imperatif.
- Copy user-facing Bahasa Indonesia; pesan validasi Zod dipertahankan identik.
- TypeScript strict + ESLint harus lulus; gate build adalah `npm run build` (Turbopack).
- Semua test eksisting (16 unit + 10 e2e) tetap hijau kecuali yang diubah eksplisit oleh rencana.
- Tanpa komentar kode baru (kecuali sudah ada polanya).

---

### Task 1: Ekstraksi Skema Zod Bersama

**Files:**
- Create: `lib/schemas/forms.ts`, `lib/schemas/forms.test.ts`
- Modify: `components/sections/ContactSection.tsx:17-22`, `components/layout/Footer.tsx:20-22`, `app/api/contact/route.ts:8-13`, `app/api/newsletter/route.ts:8-10`

**Interfaces:**
- Produces: `contactSchema`, `newsletterSchema` (objek Zod), `type ContactValues = z.infer<typeof contactSchema>`, `type NewsletterValues = z.infer<typeof newsletterSchema>`

- [ ] **Step 1 — Test gagal** (`lib/schemas/forms.test.ts`):

```ts
import { describe, expect, it } from "vitest";
import { contactSchema, newsletterSchema } from "./forms";

describe("contactSchema", () => {
  it("menerima data valid dan memotong spasi", () => {
    const result = contactSchema.safeParse({
      name: " Budi ",
      email: "budi@example.com",
      subject: "Halo",
      message: "Pesan yang cukup panjang untuk lolos validasi.",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Budi");
  });

  it("menolak pesan kurang dari 10 karakter", () => {
    expect(
      contactSchema.safeParse({ name: "Budi", email: "budi@example.com", subject: "Halo", message: "pendek" }).success
    ).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("menolak email tidak valid", () => {
    expect(newsletterSchema.safeParse({ email: "bukan-email" }).success).toBe(false);
  });

  it("menerima email valid", () => {
    expect(newsletterSchema.safeParse({ email: "budi@example.com" }).success).toBe(true);
  });
});
```

Run: `npm test -- lib/schemas/forms.test.ts` → Expected: FAIL (modul belum ada).

- [ ] **Step 2 — Implementasi** (`lib/schemas/forms.ts`):

```ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(80),
  email: z.string().trim().email("Email tidak valid"),
  subject: z.string().trim().min(1, "Subjek wajib diisi").max(120),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter").max(4000),
});

export type ContactValues = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Masukkan email yang valid"),
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;
```

- [ ] **Step 3 — Ganti 4 konsumen**: hapus definisi lokal; impor dari `@/lib/schemas/forms`. Di `ContactSection.tsx` & `Footer.tsx` hapus juga `import { z } from "zod"` jika tak lagi dipakai. Di kedua route API ganti `const schema = z.object({...})` → `const schema = contactSchema` / `newsletterSchema` (hapus `import { z }`).
- [ ] **Step 4 — Verifikasi**: `npm test` → PASS semua (16 lama + 4 baru); `npm run lint`.
- [ ] **Step 5 — Commit**: `refactor(form): ekstrak skema validasi bersama ke lib/schemas/forms`

---

### Task 2: Rate Limiter Hibrida (Upstash opsional)

**Files:**
- Modify: `lib/rate-limit.ts` (full rewrite), `app/api/contact/route.ts`, `app/api/newsletter/route.ts`, `lib/rate-limit.test.ts`, `.env.example`
- Deps: `npm install @upstash/redis @upstash/rate-limiter`

**Interfaces:**
- Produces: `rateLimitByIp(key: string, limit: number, windowMs: number): Promise<{ ok: boolean; retryAfter?: number }>`, `getClientIp(req: Request): string` (tetap sinkron)
- Consumes: env opsional `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

- [ ] **Step 1 — Install deps**: `npm install @upstash/redis @upstash/rate-limiter`
- [ ] **Step 2 — Ubah test eksisting jadi async + tambah jalur Upstash** (`lib/rate-limit.test.ts`):

Semua panggilan `rateLimitByIp(...)` dibungkus `await` (test jadi `async`). Tambah di atas file:

```ts
const { limitMock, fixedWindowMock } = vi.hoisted(() => ({
  limitMock: vi.fn(),
  fixedWindowMock: vi.fn(),
}));

vi.mock("@upstash/redis", () => ({
  Redis: class {
    constructor(_opts: unknown) {}
  },
}));

vi.mock("@upstash/rate-limiter", () => ({
  Ratelimit: Object.assign(
    class {
      limit = limitMock;
      constructor(_opts: unknown) {}
    },
    { fixedWindow: fixedWindowMock }
  ),
}));
```

Tambah describe baru (gunakan kombinasi `(limit, windowMs)` unik per test untuk memaksa instance baru karena cache modul):

```ts
describe("jalur Upstash", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    limitMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("memakai Redis dan mengizinkan saat success", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://contoh.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token-rahasia");
    limitMock.mockResolvedValue({ success: true, reset: Date.now() + 60_000 });
    await expect(rateLimitByIp("u1", 5, 60_000)).resolves.toEqual({ ok: true });
    expect(limitMock).toHaveBeenCalledWith("u1");
    expect(fixedWindowMock).toHaveBeenCalledWith(5, "60000 ms");
  });

  it("menolak dengan retryAfter saat success=false", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://contoh.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token-rahasia");
    limitMock.mockResolvedValue({ success: false, reset: Date.now() + 30_000 });
    const result = await rateLimitByIp(`u2-${Math.random()}`, 5, 90_000);
    expect(result.ok).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });
});
```

Run: `npm test -- lib/rate-limit.test.ts` → FAIL dulu (fungsi belum async/belum ada jalur).

- [ ] **Step 3 — Implementasi** (`lib/rate-limit.ts` full rewrite):

```ts
import type { Ratelimit } from "@upstash/rate-limiter";

type RateLimitResult = { ok: boolean; retryAfter?: number };

const buckets = new Map<string, { count: number; resetAt: number }>();

function inMemoryLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return {
      ok: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  return { ok: true };
}

const limiters = new Map<string, Promise<Ratelimit | null>>();

function getUpstashLimiter(limit: number, windowMs: number): Promise<Ratelimit | null> {
  const cacheKey = `${limit}:${windowMs}`;
  let cached = limiters.get(cacheKey);
  if (!cached) {
    cached = (async () => {
      const url = process.env.UPSTASH_REDIS_REST_URL;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN;
      if (!url || !token) return null;
      const [{ Redis }, { Ratelimit: RatelimitClass }] = await Promise.all([
        import("@upstash/redis"),
        import("@upstash/rate-limiter"),
      ]);
      return new RatelimitClass({
        redis: new Redis({ url, token }),
        limiter: RatelimitClass.fixedWindow(limit, `${windowMs} ms`),
        prefix: "kantongin:ratelimit",
      }) as Ratelimit;
    })();
    limiters.set(cacheKey, cached);
  }
  return cached;
}

export async function rateLimitByIp(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const upstash = await getUpstashLimiter(limit, windowMs);
  if (upstash) {
    const { success, reset } = await upstash.limit(key);
    if (success) return { ok: true };
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
    };
  }
  return inMemoryLimit(key, limit, windowMs);
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
```

Catatan: test lama jalur in-memory berjalan tanpa env → `getUpstashLimiter` mengembalikan null sebelum import, mock tidak terpengaruh.

- [ ] **Step 4 — Update pemanggil**: kedua route API, baris rate limit menjadi:
  - contact: `const limited = await rateLimitByIp(\`contact:${getClientIp(req)}\`, 5, 60_000);`
  - newsletter: `const limited = await rateLimitByIp(\`newsletter:${getClientIp(req)}\`, 3, 60_000);`
- [ ] **Step 5 — .env.example** tambah:

```
# Opsional: aktifkan rate limiting Redis (disarankan di serverless produksi)
# UPSTASH_REDIS_REST_URL=
# UPSTASH_REDIS_REST_TOKEN=
```

- [ ] **Step 6 — Verifikasi**: `npm test && npm run lint` → PASS.
- [ ] **Step 7 — Commit**: `refactor(api): rate limiter hibrida dengan Upstash opsional`

---

### Task 3: Blog fs-Based + Sitemap Satu Sumber Kebenaran

**Files:**
- Modify: `app/blog/_posts.ts` (full rewrite), `app/blog/[slug]/page.tsx`, `app/sitemap.ts` (full rewrite), `next.config.ts` (full rewrite)
- Create: `lib/mdx-components.tsx`, `app/blog/_posts.test.ts`
- Delete: `mdx-components.tsx` (root)
- Deps: `npm install gray-matter next-mdx-remote` ; `npm uninstall @next/mdx @mdx-js/loader @mdx-js/react` (**@types/mdx dipertahankan** untuk tipe `MDXComponents`)
- Test: `app/blog/_posts.test.ts`, e2e `blog.spec.ts`

**Interfaces:**
- Produces (`_posts.ts`): `type PostFrontmatter = { title: string; description: string; date: string; author: string; tags: string[] }`, `type Post = PostFrontmatter & { slug: string }`, `type PostContent = { frontmatter: PostFrontmatter; content: string }`, `posts: Post[]` (sort desc by date), `getPost(slug: string): PostContent | null`
- Consumes: `mdxComponents` dari `lib/mdx-components.tsx`

- [ ] **Step 1 — Install/uninstall deps** (perintah di atas).
- [ ] **Step 2 — Test gagal** (`app/blog/_posts.test.ts`):

```ts
import { describe, expect, it } from "vitest";
import { getPost, posts } from "./_posts";

describe("_posts (fs)", () => {
  it("menemukan minimal dua post terurut terbaru dulu", () => {
    expect(posts.length).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date.localeCompare(posts[i].date)).toBeGreaterThanOrEqual(0);
    }
  });

  it("getPost mengembalikan frontmatter dan konten", () => {
    const post = getPost("affiliate-marketing-untuk-umkm");
    expect(post).not.toBeNull();
    expect(post?.frontmatter.title).toBeTruthy();
    expect(post?.content.length).toBeGreaterThan(100);
  });

  it("getPost mengembalikan null untuk slug tak dikenal atau berbahaya", () => {
    expect(getPost("tidak-ada")).toBeNull();
    expect(getPost("../layout")).toBeNull();
  });
});
```

Run: `npm test -- app/blog/_posts.test.ts` → FAIL (API lama mengembalikan komponen, bukan content).

- [ ] **Step 3 — Rewrite `_posts.ts`:**

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
};

export type Post = PostFrontmatter & { slug: string };

export type PostContent = { frontmatter: PostFrontmatter; content: string };

const POSTS_DIR = path.join(process.cwd(), "app", "blog", "_posts");

function readPostFile(slug: string): PostContent | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: data as PostFrontmatter, content };
}

function listSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export const posts: Post[] = listSlugs()
  .map((slug) => {
    const post = readPostFile(slug);
    if (!post) throw new Error(`Frontmatter tidak valid: ${slug}`);
    return { slug, ...post.frontmatter };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): PostContent | null {
  if (!posts.some((post) => post.slug === slug)) return null;
  return readPostFile(slug);
}
```

Run: `npm test -- app/blog/_posts.test.ts` → PASS.

- [ ] **Step 4 — Pindahkan map tipografi**: buat `lib/mdx-components.tsx` berisi isi `mdx-components.tsx` root persis, hanya beda bentuk ekspor:

```tsx
import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  // salin seluruh mapping elemen (h1…hr) apa adanya dari mdx-components.tsx lama
};
```

Lalu hapus `mdx-components.tsx` root.

- [ ] **Step 5 — Update `[slug]/page.tsx`:**
  - Import tambah: `import { MDXRemote } from "next-mdx-remote/rsc";` dan `import { mdxComponents } from "@/lib/mdx-components";`
  - Di `BlogPostPage`, ganti destrukturisasi:

```tsx
const mod = getPost(slug);
if (!mod) notFound();

const { frontmatter: post, content } = mod;
```

  - Ganti `<Content />` (dan hapus `const Content = mod.default;`) menjadi:

```tsx
<MDXRemote source={content} components={mdxComponents} />
```

  - `generateMetadata` tetap: `getPost(slug)?.frontmatter` valid terhadap tipe baru.

- [ ] **Step 6 — Rewrite `sitemap.ts`:**

```ts
import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";
import { posts } from "./blog/_posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogEntries,
  ];
}
```

- [ ] **Step 7 — Bersihkan pipeline MDX** — `next.config.ts` menjadi:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 8 — Verifikasi**: `npm test && npm run build` (SSG 2 artikel sukses) → `npx playwright test e2e/blog.spec.ts` → 3 PASS (daftar, JSON-LD BlogPosting, 404).
- [ ] **Step 9 — Commit**: `refactor(blog): ganti import.meta.glob dengan fs + next-mdx-remote, sitemap satu sumber kebenaran`

---

### Task 4: Hapus Dead Code

**Files:**
- Delete: `styles/theme.css`, `lib/theme.ts`, `hooks/use-media-query.ts`, `components/ui/card.tsx`, `components/ui/skeleton.tsx`, `components/ui/separator.tsx`, `components/ui/avatar.tsx`

- [ ] Verifikasi ulang nol referensi: grep pola `theme.css|use-media-query|ui/card|ui/skeleton|ui/separator|ui/avatar|@/lib/theme` pada app/components/lib/hooks → kosong.
- [ ] `git rm` ketujuh file; hapus folder `styles/` jika kosong.
- [ ] `npm run build` → PASS.
- [ ] Commit: `chore: hapus dead code (theme, use-media-query, primitif ui tak terpakai)`

---

### Task 5: Halaman Legal + Bersihkan Placeholder Sosial

**Files:**
- Create: `components/layout/LegalPage.tsx`, `app/kebijakan-privasi/page.tsx`, `app/syarat-ketentuan/page.tsx`, `app/kebijakan-cookie/page.tsx`
- Modify: `components/layout/Footer.tsx:43-47`, `constants/site.ts:7-13`, `app/sitemap.ts`, `e2e/home.spec.ts`

**Interfaces:**
- Produces: `LegalPage({ title: string; updated: string; children: ReactNode })` server component; routes `/kebijakan-privasi`, `/syarat-ketentuan`, `/kebijakan-cookie`

- [ ] **Step 1 — `siteConfig`**: hapus baris `linkedin: "#"` dan `youtube: "#"` (footer sudah memfilter `"#"`, UI tak berubah).
- [ ] **Step 2 — Komponen bersama** `components/layout/LegalPage.tsx`:

```tsx
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const prose =
  "[&_h2]:mt-10 [&_h2]:scroll-mt-28 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-foreground [&_p]:mt-5 [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_li]:leading-relaxed [&_li]:text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:decoration-primary/40 [&_a]:underline-offset-4 [&_blockquote]:mt-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground";

type LegalPageProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <main id="main" tabIndex={-1}>
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 lg:pb-28">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke beranda
        </Link>
        <header className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted">Terakhir diperbarui: {updated}</p>
        </header>
        <div className={`mt-10 border-t border-border pt-8 ${prose}`}>{children}</div>
      </article>
    </main>
  );
}
```

- [ ] **Step 3 — Tiga halaman** dengan metadata + konten template generik. Struktur bagian wajib:
  - Kebijakan Privasi: identitas pengendali data `[Nama Entitas]`, jenis data yang dikumpulkan, tujuan penggunaan, dasar hukum, berbagi data, hak subjek, retensi, kontak `siteConfig.email`.
  - Syarat & Ketentuan: penerimaan ketentuan, layanan, kewajiban klien, pembayaran, hak kekayaan intelektual, batasan tanggung jawab, perubahan ketentuan, kontak.
  - Kebijakan Cookie: apa itu cookie, jenis yang dipakai (fungsional/analitik), cara mengelola cookie di browser, kontak.
  
  Setiap halaman mencantumkan catatan templat: *"Dokumen ini adalah template awal — sesuaikan dengan praktik nyata sebelum digunakan produksi."* Contoh struktur `app/kebijakan-privasi/page.tsx`:

```tsx
import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Bagaimana KantongIn mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
};

export default function KebijakanPrivasiPage() {
  return (
    <LegalPage title="Kebijakan Privasi" updated="23 Agustus 2026">
      {/* konten h2/p/ul sesuai struktur bagian di atas */}
    </LegalPage>
  );
}
```

- [ ] **Step 4 — Footer** (`Footer.tsx:43-47`):

```ts
const legalLinks = [
  { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
  { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
  { label: "Kebijakan Cookie", href: "/kebijakan-cookie" },
];
```

(Tanpa onClick handler — render `<a>` biasa seperti sekarang.)

- [ ] **Step 5 — Sitemap**: masukkan tiga URL setelah blogEntries:

```ts
const legalEntries: MetadataRoute.Sitemap = [
  { url: `${siteConfig.url}/kebijakan-privasi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${siteConfig.url}/syarat-ketentuan`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${siteConfig.url}/kebijakan-cookie`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
];
```

dan spread `...legalEntries` dalam array return.

- [ ] **Step 6 — E2E baru** (`e2e/home.spec.ts`):

```ts
test("tautan kebijakan privasi dapat diakses", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Kebijakan Privasi" }).click();
  await expect(page.getByRole("heading", { level: 1, name: /Kebijakan Privasi/ })).toBeVisible();
});
```

- [ ] **Step 7 — Verifikasi**: `npm run build && npx playwright test e2e/home.spec.ts` → PASS.
- [ ] **Commit**: `feat(legal): halaman kebijakan privasi, syarat & ketentuan, cookie + hapus sosial kosong`

---

### Task 6: Dokumentasi + Gerbang Verifikasi Penuh

**Files:**
- Modify: `README.md`

- [ ] **README**: tabel env tambah dua baris (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — "Opsional…"); bagian Tech Stack sesuaikan (gray-matter, next-mdx-remote; hapus implikasi pipeline @next/mdx); Struktur Konten: catat halaman legal dan mekanisme blog tetap sama (drop file `.mdx` + blok frontmatter).
- [ ] Commit: `docs: perbarui README untuk rate limiter Upstash opsional & halaman legal`
- [ ] **Gerbang akhir (semua wajib lulus):**

```bash
npm run lint && npm test && npm run build && npm run test:e2e && npm run lighthouse
```
