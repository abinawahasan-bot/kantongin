import { test, expect } from "@playwright/test";

test.describe("Halaman Harga", () => {
  test("halaman /harga menampilkan intro, estimator, paket & FAQ", async ({ page }) => {
    await page.goto("/harga");
    await expect(page).toHaveTitle(/Harga/);
    await expect(
      page.getByRole("heading", { name: /Harga Transparan, Tanpa Kejutan/ })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Hitung Estimasi Website/ })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Pilih Paket Sesuai Kebutuhan/ })
    ).toBeVisible();
    await expect(page.getByText("Landing Page", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Company Profile", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Custom / Web App", { exact: true }).first()).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Transparansi dari Awal/ })
    ).toBeVisible();

    const waLinks = page.locator('#paket a[href*="wa.me"]');
    await expect(waLinks).toHaveCount(3);
    await expect(waLinks.first()).toHaveAttribute("href", /wa\.me\//);

    await expect(
      page.getByRole("heading", { name: /Pertanyaan yang Sering Diajukan/ })
    ).toBeVisible();
    await expect(page.locator("#faq button").first()).toBeVisible();
  });

  test("halaman /harga memuat BreadcrumbList JSON-LD", async ({ page }) => {
    await page.goto("/harga");
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const breadcrumb = scripts.find((s) => s.includes('"BreadcrumbList"'));
    expect(breadcrumb).toBeTruthy();
    expect(breadcrumb).toContain('"name":"Beranda"');
    expect(breadcrumb).toContain('"name":"Harga"');
  });

  test("estimator di /harga terhubung ke WhatsApp", async ({ page }) => {
    await page.goto("/harga");
    const estimator = page.locator("#estimasi");
    await estimator.getByText("Company Profile", { exact: true }).first().click();
    await expect(
      estimator.getByRole("link", { name: /Kirim rincian via WhatsApp/i })
    ).toHaveAttribute("href", /wa\.me\//);
  });
});