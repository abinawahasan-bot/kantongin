import { test, expect } from "@playwright/test";

test.describe("Navigasi menu", () => {
  test("item Beranda di navbar membuka beranda dari halaman lain", async ({
    page,
  }) => {
    await page.goto("/harga");
    await page
      .locator("header nav")
      .getByRole("link", { name: "Beranda", exact: true })
      .click();
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", {
        name: /Website Profesional yang Mendatangkan Pelanggan/,
      })
    ).toBeVisible();
  });

  test("logo navbar kembali ke beranda dari halaman lain", async ({ page }) => {
    await page.goto("/blog");
    await page
      .locator("header")
      .getByRole("link", { name: /KantongIn - Beranda/i })
      .click();
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", {
        name: /Website Profesional yang Mendatangkan Pelanggan/,
      })
    ).toBeVisible();
  });

  test("klik logo saat sudah di beranda hanya scroll ke atas", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    await page
      .locator("header")
      .getByRole("link", { name: /KantongIn - Beranda/i })
      .click();
    await page.waitForTimeout(1200);
    const y = await page.evaluate(() => window.scrollY);
    expect(y).toBeLessThan(100);
  });

  test("anchor section dari halaman lain membuka beranda pada section tujuan", async ({
    page,
  }) => {
    await page.goto("/harga");
    await page
      .locator("header nav")
      .getByRole("link", { name: "Layanan", exact: true })
      .click();
    await expect(page).toHaveURL(/#services$/);
    await expect(page.locator("#services")).toBeVisible();
  });

  test("menu Beranda di footer membuka beranda dari halaman lain", async ({
    page,
  }) => {
    await page.goto("/layanan");
    await page
      .locator("footer")
      .getByRole("link", { name: "Beranda", exact: true })
      .click();
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", {
        name: /Website Profesional yang Mendatangkan Pelanggan/,
      })
    ).toBeVisible();
  });

  test("deep-link beranda dengan hash membuka section tujuan", async ({
    page,
  }) => {
    await page.goto("/#services");
    await expect(page.locator("#services")).toBeVisible();
  });
});