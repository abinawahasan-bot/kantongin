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

  test("slug yang tidak dikenal menampilkan 404", async ({ page }) => {
    await page.goto("/blog/tidak-ada");
    await expect(page).toHaveTitle(/404/);
  });
});
