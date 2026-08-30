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

  const openPages = [
    { path: "/", label: "beranda" },
    { path: "/tentang-kami", label: "tentang kami" },
    { path: "/blog", label: "blog" },
    { path: "/harga", label: "harga" },
  ];

  for (const { path, label } of openPages) {
    test(`intro animasi bar saat membuka ${label} (${path})`, async ({
      page,
    }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const samples: number[] = [];
      const t0 = Date.now();
      while (Date.now() - t0 < 2000) {
        samples.push(
          await page.evaluate(() => {
            const el = document.querySelector('[data-testid="scroll-fill"]');
            if (!el) return 0;
            const m = getComputedStyle(el).transform;
            if (m === "none") return 0;
            return Number(m.split(",")[0].replace("matrix(", ""));
          })
        );
        await page.waitForTimeout(80);
      }
      const peak = Math.max(...samples);
      expect(peak).toBeGreaterThan(0.9);
      const settled = samples[samples.length - 1];
      expect(settled).toBeLessThan(0.6);
    });
  }

  test("intro bar terpicu ulang saat navigasi client-side", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1100);
    await page.locator("header nav").getByRole("link", { name: "Blog", exact: true }).click();
    const samples: number[] = [];
    const t0 = Date.now();
    while (Date.now() - t0 < 2000) {
      samples.push(
        await page.evaluate(() => {
          const el = document.querySelector('[data-testid="scroll-fill"]');
          if (!el) return 0;
          const m = getComputedStyle(el).transform;
          if (m === "none") return 0;
          return Number(m.split(",")[0].replace("matrix(", ""));
        })
      );
      await page.waitForTimeout(80);
    }
    expect(Math.max(...samples)).toBeGreaterThan(0.9);
  });

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