import { test, expect } from "@playwright/test";

/** Tunggu hidrasi client component agar listener popup benar-benar terpasang. */
async function waitForHydration(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
}

test.describe("Popup konversi", () => {
  test("tidak muncul di beranda", async ({ page }) => {
    await page.goto("/");
    await page.mouse.move(400, -10);
    await page.waitForTimeout(500);
    await expect(
      page.getByRole("dialog", { name: /Konsultasi gratis via WhatsApp/i })
    ).toHaveCount(0);
  });

  test("halaman harga muncul saat mouse keluar viewport dan tertutup permanen dalam sesi", async ({
    page,
  }) => {
    await page.goto("/harga");
    await waitForHydration(page);
    await page.mouse.move(400, -10);
    const dialog = page.getByRole("dialog", {
      name: /Konsultasi gratis via WhatsApp/i,
    });
    await expect(dialog).toBeVisible();

    await page.getByRole("button", { name: "Tutup popup" }).click();
    await expect(dialog).toHaveCount(0);

    await page.mouse.move(400, 300);
    await page.mouse.move(400, -10);
    await page.waitForTimeout(500);
    await expect(dialog).toHaveCount(0);
  });

  test("halaman layanan muncul saat exit-intent", async ({ page }) => {
    await page.goto("/layanan");
    await waitForHydration(page);
    await page.mouse.move(400, -10);
    await expect(
      page.getByRole("dialog", { name: /Konsultasi gratis via WhatsApp/i })
    ).toBeVisible();
  });

  test("artikel blog muncul setelah scroll 60%", async ({ page }) => {
    await page.goto("/blog/pentingnya-website-untuk-umkm");
    await waitForHydration(page);
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await expect(
      page.getByRole("dialog", { name: /Konsultasi gratis via WhatsApp/i })
    ).toBeVisible();
  });

  test("popup hanya muncul sekali per sesi antar halaman", async ({ page }) => {
    await page.goto("/layanan");
    await waitForHydration(page);
    await page.mouse.move(400, -10);
    const dialog = page.getByRole("dialog", {
      name: /Konsultasi gratis via WhatsApp/i,
    });
    await expect(dialog).toBeVisible();
    await page.getByRole("button", { name: "Tutup popup" }).click();

    await page.goto("/harga");
    await page.mouse.move(400, 300);
    await page.mouse.move(400, -10);
    await page.waitForTimeout(500);
    await expect(dialog).toHaveCount(0);
  });
});