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
});