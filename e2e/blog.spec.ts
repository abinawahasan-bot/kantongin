import { test, expect } from "@playwright/test";

test.describe("Blog", () => {
  test("halaman blog menampilkan daftar artikel", async ({ page }) => {
    await page.goto("/blog");
    await expect(
      page.getByRole("heading", { name: /Wawasan & strategi terbaru/i })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Pentingnya Website untuk UMKM/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Landing Page vs Toko Online/i })).toBeVisible();
  });

  test("artikel dapat dibuka dengan konten dan metadata", async ({ page }) => {
    await page.goto("/blog/pentingnya-website-untuk-umkm");
    await expect(page).toHaveTitle(/Pentingnya Website untuk UMKM/);
    await expect(
      page.getByRole("heading", { name: /Pentingnya Website untuk UMKM/ })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Kembali ke blog/i })).toBeVisible();
    const blogPostingCount = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll(
        (scripts) =>
          scripts.filter((s) => s.textContent?.includes("BlogPosting")).length
      );
    expect(blogPostingCount).toBeGreaterThanOrEqual(1);
  });

  test("artikel menampilkan panel CTA WhatsApp dengan micro-copy", async ({
    page,
  }) => {
    await page.goto("/blog/pentingnya-website-untuk-umkm");
    await expect(
      page.getByRole("heading", { name: /Mau Menerapkannya di Website Anda\?/ })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Konsultasi Gratis via WhatsApp/i })
    ).toHaveAttribute("href", /wa\.me\//);
    await expect(
      page.getByText("Gratis · Tanpa komitmen · Konsultasi via WhatsApp")
    ).toBeVisible();
  });

  test("index blog menampilkan panel CTA", async ({ page }) => {
    await page.goto("/blog");
    await expect(
      page.getByRole("link", { name: /Konsultasi Gratis via WhatsApp/i })
    ).toHaveCount(1);
  });

  test("slug yang tidak dikenal menampilkan 404", async ({ page }) => {
    await page.goto("/blog/tidak-ada");
    await expect(
      page.getByRole("heading", { name: /Halaman tidak ditemukan/ })
    ).toBeVisible();
  });

  test("setiap artikel baru menampilkan judul dan CTA WhatsApp", async ({ page }) => {
    const slugs = [
      "berapa-biaya-bikin-website",
      "company-profile-vs-landing-page",
      "cara-membuat-toko-online-untuk-usaha-kecil",
      "kapan-bisnis-butuh-maintenance-website",
      "tanda-bisnis-siap-go-online",
      "jasa-pembuatan-website-yogyakarta",
    ];
    for (const slug of slugs) {
      await page.goto(`/blog/${slug}`);
      await expect(page.locator("article h1")).toHaveCount(1);
      await expect(page.locator("article a[href*='wa.me']")).not.toHaveCount(0);
    }
  });

  test("detail artikel dan halaman kategori memuat BreadcrumbList JSON-LD", async ({
    page,
  }) => {
    for (const path of [
      "/blog/pentingnya-website-untuk-umkm",
      "/blog/kategori/umkm-digital",
    ]) {
      await page.goto(path);
      const breadcrumbCount = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts.filter((s) => s.textContent?.includes('"BreadcrumbList"')).length
        );
      expect(breadcrumbCount).toBeGreaterThanOrEqual(1);
    }
  });

  test("halaman kategori menampilkan kartu artikel", async ({ page }) => {
    await page.goto("/blog/kategori/umkm-digital");
    await expect(
      page.getByRole("heading", { name: /UMKM & Digital/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Pentingnya Website untuk UMKM/i })
    ).toBeVisible();
  });

  test("detail artikel menampilkan artikel terkait", async ({ page }) => {
    await page.goto("/blog/cara-memilih-jasa-pembuatan-website");
    await expect(
      page.getByRole("heading", { name: "Artikel terkait" })
    ).toBeVisible();
    const relatedLinks = await page
      .locator('section[aria-labelledby="artikel-terkait"] a[href^="/blog/"]')
      .count();
    expect(relatedLinks).toBeGreaterThanOrEqual(1);
  });
});
