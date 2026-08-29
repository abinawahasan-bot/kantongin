import { test, expect } from "@playwright/test";

test.describe("Kontak", () => {
  test("form kontak memvalidasi isian kosong", async ({ page }) => {
    await page.goto("/#contact");
    await expect(page.locator("#contact")).toBeVisible();

    await page.getByRole("button", { name: "Kirim via WhatsApp" }).click();
    await expect(page.getByText("Nama wajib diisi")).toBeVisible();
    await expect(page.getByText("Subjek wajib diisi")).toBeVisible();
    await expect(page.getByText("Pesan minimal 10 karakter")).toBeVisible();
  });

  test("submit valid membuka WhatsApp dengan pesan terformat", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.open = (url?: string | URL) => {
        (window as unknown as { __openedUrl: string }).__openedUrl = String(url);
        return null;
      };
    });

    await page.goto("/#contact");
    const form = page.locator("#contact");
    await form.getByLabel("Nama").fill("Budi Santoso");
    await form.getByLabel("Email").fill("budi@example.com");
    await form
      .getByLabel("Jenis Layanan")
      .selectOption({ label: "Landing Page" });
    await form.getByLabel("Subjek").fill("Proyek landing page");
    await form
      .getByLabel("Pesan")
      .fill("Saya ingin membuat landing page profesional.");
    await page.getByRole("button", { name: "Kirim via WhatsApp" }).click();

    const opened = await page.evaluate(() =>
      String(
        (window as unknown as { __openedUrl: string }).__openedUrl
      )
    );
    expect(opened).toContain("https://wa.me/6285775149968?text=");
    expect(opened).toContain(encodeURIComponent("Budi Santoso"));
    expect(opened).toContain(encodeURIComponent("Landing Page"));
  });
});