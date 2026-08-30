import { test, expect } from "@playwright/test";

test.describe("Beranda", () => {
  test("memuat halaman dengan konten utama", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/KantongIn/);
    await expect(
      page.getByRole("heading", { name: /Website Profesional/ })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Konsultasi Gratis" }).first()).toBeVisible();
  });

  test("navbar menyediakan navigasi anchor", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navigasi utama" });
    await expect(nav.getByRole("link", { name: "Layanan" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Proses" })).toHaveAttribute(
      "href",
      "#how-it-works"
    );
    await expect(nav.getByRole("link", { name: "Harga" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/blog"
    );
    await expect(nav.getByRole("link", { name: "Kontak" })).toHaveAttribute(
      "href",
      "#contact"
    );
  });

  test("menampilkan semua section utama", async ({ page }) => {
    await page.goto("/");
    for (let step = 1; step <= 8; step += 1) {
      await page.evaluate((s) => {
        window.scrollTo(0, (document.body.scrollHeight / 8) * s);
      }, step);
      await page.waitForTimeout(120);
    }
    for (const id of ["home", "services", "portfolio", "website-baru", "pricing", "faq", "contact", "how-it-works"]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test("skip-link tersedia", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Lewati ke konten" })).toBeVisible();
  });

  test("footer menampilkan tautan sosial", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByLabel(/KantongIn di instagram/i)).toHaveAttribute(
      "href",
      "https://instagram.com/kantonginofc"
    );
    await expect(page.getByRole("link", { name: "abinawahasan@gmail.com" })).toBeVisible();
  });

  test("tautan kebijakan privasi dapat diakses", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Kebijakan Privasi" }).click();
    await expect(page.getByRole("heading", { level: 1, name: /Kebijakan Privasi/ })).toBeVisible();
  });
});
