import { test, expect } from "@playwright/test";

test.describe("Kontak", () => {
  test("form kontak memvalidasi isian kosong", async ({ page }) => {
    await page.goto("/#contact");
    await expect(page.locator("#contact")).toBeVisible();

    await page.getByRole("button", { name: "Kirim Pesan" }).click();
    await expect(page.getByText("Nama wajib diisi")).toBeVisible();
    await expect(page.getByText("Subjek wajib diisi")).toBeVisible();
    await expect(page.getByText("Pesan minimal 10 karakter")).toBeVisible();
  });

  test("newsletter menampilkan status setelah submit", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByLabel("Alamat email untuk newsletter").fill("user@example.com");
    await page.getByRole("button", { name: /Berlangganan/i }).click();

    const status = page.locator('[role="status"]');
    await expect(status).toBeVisible();
    await expect(status).toHaveText(/Layanan belum dikonfigurasi|Terima kasih/);
  });
});
