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
    await expect(page.locator("details")).toHaveCount(11);
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

  test("manifest-icon menyajikan PNG 192/512 dan menolak ukuran lain", async ({
    page,
  }) => {
    const res512 = await page.request.get("/manifest-icon?size=512");
    expect(res512.status()).toBe(200);
    expect((await res512.headers())["content-type"]).toContain("image/png");

    const res192 = await page.request.get("/manifest-icon?size=192");
    expect(res192.status()).toBe(200);
    expect((await res192.headers())["content-type"]).toContain("image/png");

    expect((await page.request.get("/manifest-icon?size=999")).status()).toBe(400);
    expect((await page.request.get("/manifest-icon")).status()).toBe(400);
  });

  test("apple-icon menyajikan PNG", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator('link[rel="apple-touch-icon"]')
    ).toHaveAttribute("href", /\/apple-icon/);
    const res = await page.request.get("/apple-icon");
    expect(res.status()).toBe(200);
    expect((await res.headers())["content-type"]).toContain("image/png");
  });

  test("manifest web app memuat ikon PNG & theme color", async ({ page }) => {
    await page.goto("/");
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute("href", /manifest\.webmanifest/);
    const res = await page.request.get("/manifest.webmanifest");
    expect(res.status()).toBe(200);
    const manifest = await res.json();
    const iconUrls = manifest.icons.map((icon: { src: string }) => icon.src);
    expect(iconUrls).toContain("/manifest-icon?size=192");
    expect(iconUrls).toContain("/manifest-icon?size=512");
    expect(manifest.theme_color).toBe("#22C55E");
    expect(manifest.lang).toBe("id");
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