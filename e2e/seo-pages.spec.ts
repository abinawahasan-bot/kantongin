import { test, expect } from "@playwright/test";

test.describe("SEO & halaman statis", () => {
  test("OG image dinamis merespons PNG", async ({ page }) => {
    const res = await page.request.get("/og-image?title=Halo%20Dunia");
    expect(res.status()).toBe(200);
    expect((await res.headers())["content-type"]).toContain("image/png");
  });

  test("OG image tanpa title mengembalikan 400", async ({ page }) => {
    expect((await page.request.get("/og-image")).status()).toBe(400);
  });

  test("halaman tentang-kami menampilkan konten utama", async ({ page }) => {
    await page.goto("/tentang-kami");
    await expect(page).toHaveTitle(/Tentang Kami/);
    await expect(
      page.getByRole("heading", { name: /Tentang KantongIn/ })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Cara Kami Bekerja/ })
    ).toBeVisible();
    const waLink = page.getByRole("link", { name: /Konsultasi Gratis/i });
    await expect(waLink).toHaveAttribute("href", /wa\.me\//);
  });

  test("halaman layanan menampilkan layanan, proses & FAQ", async ({ page }) => {
    await page.goto("/layanan");
    await expect(page).toHaveTitle(/Layanan/);
    await expect(
      page.getByRole("heading", { name: /Semua Jenis Website yang Anda Butuhkan/ })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Proses yang Jelas dari Awal/ })
    ).toBeVisible();
    await expect(page.locator("details")).toHaveCount(7);
    const waLink = page.getByRole("link", {
      name: /Konsultasi layanan ini/i,
    });
    await expect(waLink.first()).toHaveAttribute("href", /wa\.me\//);
    await expect(
      page.getByRole("heading", { name: /Garansi & Komitmen Kami/ })
    ).toBeVisible();
  });

  test("halaman legal mencerminkan identitas bisnis saat ini", async ({ page }) => {
    for (const path of ["/kebijakan-privasi", "/syarat-ketentuan", "/kebijakan-cookie"]) {
      await page.goto(path);
      await expect(page.locator("body")).not.toContainText("template awal");
      await expect(page.locator("body")).not.toContainText(/affiliate|kreator|Digital Marketing/i);
      await expect(page.locator("body")).toContainText("30 Agustus 2026");
    }
  });

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

  test("blog index memuat ItemList JSON-LD", async ({ page }) => {
    await page.goto("/blog");
    const itemListCount = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.filter((s) => s.textContent?.includes('"ItemList"')).length
      );
    expect(itemListCount).toBeGreaterThanOrEqual(1);
  });

  test("RSS feed tersedia sebagai application/rss+xml", async ({ page }) => {
    const res = await page.request.get("/feed.xml");
    expect(res.status()).toBe(200);
    expect((await res.headers())["content-type"]).toContain("application/rss+xml");
    const body = (await res.text()) as string;
    expect(body).toContain('<rss version="2.0">');
    expect(body).toContain("<item>");
  });

  test("halaman layanan memuat BreadcrumbList dan ItemList JSON-LD", async ({ page }) => {
    await page.goto("/layanan");
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) => scripts.map((s) => s.textContent ?? ""));
    expect(jsonLd.some((text) => text.includes('"BreadcrumbList"'))).toBe(true);
    expect(jsonLd.some((text) => text.includes('"ItemList"'))).toBe(true);
    expect(jsonLd.some((text) => text.includes('"FAQPage"'))).toBe(true);
  });
});