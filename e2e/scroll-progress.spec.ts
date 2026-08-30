import { test, expect } from "@playwright/test";

test.describe("Progress bar top", () => {
  const pages = [
    { path: "/", label: "beranda" },
    { path: "/layanan", label: "layanan" },
    { path: "/blog", label: "index blog" },
    { path: "/blog/kategori/e-commerce", label: "kategori blog" },
  ];

  for (const { path, label } of pages) {
    test(`track selalu terlihat di ${label} (${path})`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      await expect(page.getByTestId("scroll-track")).toBeVisible();
      await expect(page.getByTestId("scroll-fill")).toBeAttached();
    });
  }

  test("isi bar mengikuti scroll di beranda", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.mouse.wheel(0, 4000);
    await page.waitForTimeout(800);

    const scaleX = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="scroll-fill"]');
      if (!el) return null;
      const m = getComputedStyle(el).transform;
      if (m === "none") return 0;
      return Number(m.split(",")[0].replace("matrix(", ""));
    });

    expect(scaleX).not.toBeNull();
    expect(scaleX!).toBeGreaterThan(0.2);
  });
});