import { test, expect } from "@playwright/test";

const openedUrl = () =>
  `String(${(window as unknown as { __openedUrl: string }).__openedUrl})`;

test.describe("Estimator Harga & Wizard", () => {
  test("wizard memvalidasi langkah pertama (layanan & budget)", async ({
    page,
  }) => {
    await page.goto("/#contact");
    await expect(page.locator("#contact")).toBeVisible();

    await page.getByRole("button", { name: "Lanjut ke Detail" }).click();
    await expect(page.getByText("Pilih jenis layanan dulu")).toBeVisible();
    await expect(
      page.getByText("Pilih perkiraan budget", { exact: true })
    ).toBeVisible();
  });

  test("wizard 3 langkah mengirim rincian ke WhatsApp", async ({ page }) => {
    await page.addInitScript(() => {
      window.open = (url?: string | URL) => {
        (window as unknown as { __openedUrl: string }).__openedUrl = String(url);
        return null;
      };
    });

    await page.goto("/#contact");
    await expect(page.locator("#contact")).toBeVisible();
    const wizard = page.locator("#contact");

    // Langkah 1: kebutuhan
    await wizard.getByText("Company Profile", { exact: true }).click();
    await wizard.getByText("Blog / Artikel", { exact: true }).click();
    await wizard
      .getByText("Maintenance & support (1 bulan)", { exact: true })
      .click();
    await wizard
      .getByLabel("Perkiraan Budget")
      .selectOption({ label: "Rp 1–3 juta" });
    await expect(page.getByText("Mulai dari Rp 1.750.000")).toBeVisible();
    await page.getByRole("button", { name: "Lanjut ke Detail" }).click();

    // Langkah 2: detail
    await expect(
      page.locator("#estimate-subject")
    ).toHaveValue("Company Profile — Estimasi Harga");
    await page
      .getByLabel("Pesan")
      .fill("Saya butuh website untuk perusahaan konstruksi dua lantai.");
    await page.getByRole("button", { name: "Lanjut ke Kontak" }).click();

    // Langkah 3: kontak
    await page.getByLabel("Nama").fill("Budi Santoso");
    await page.getByLabel("Email").fill("budi@example.com");
    await page.getByRole("button", { name: "Kirim via WhatsApp" }).click();

    const message = await page.evaluate(openedUrl);
    expect(message).toContain("https://wa.me/6285775149968?text=");
    expect(message).toContain(encodeURIComponent("Budi Santoso"));
    expect(message).toContain(encodeURIComponent("Company Profile"));
    expect(message).toContain(encodeURIComponent("Rp 1–3 juta"));
    expect(message).toContain(encodeURIComponent("Mulai dari Rp 1.750.000"));
    expect(message).toContain(encodeURIComponent("• Blog / Artikel (+Rp 300.000)"));
    await expect(page.getByText("WhatsApp dibuka di tab baru.")).toBeVisible();
  });

  test("estimator /layanan mengirim rincian via WhatsApp langsung", async ({
    page,
  }) => {
    await page.goto("/layanan");
    const estimator = page.locator("#estimasi");
    await estimator
      .getByText("E-commerce / Toko Online", { exact: true })
      .click();
    await estimator
      .getByText("Toko online + payment gateway", { exact: true })
      .click();
    await expect(
      page.getByText("Mulai dari Rp 4.000.000", { exact: true })
    ).toBeVisible();

    const popupPromise = page.waitForEvent("popup");
    await page
      .getByRole("link", { name: "Kirim rincian via WhatsApp" })
      .click();
    const popup = await popupPromise;
    const message = popup.url();
    expect(message).toContain("api.whatsapp.com/send/");
    expect(message).toContain("phone=6285775149968");
    const decoded = decodeURIComponent(message.replace(/\+/g, " "));
    expect(decoded).toContain("E-commerce / Toko Online");
    expect(decoded).toContain("Mulai dari Rp 4.000.000");
    expect(decoded).toContain("Toko online + payment gateway (+Rp 1.500.000)");
  });

  test("CTA /layanan membawa pilihan ke wizard beranda (?estimasi=)", async ({
    page,
  }) => {
    await page.goto("/layanan");
    const estimator = page.locator("#estimasi");
    await estimator.getByText("Landing Page", { exact: true }).click();
    await page.getByLabel("Perkiraan Budget").selectOption({ label: "Belum tahu" });
    await page
      .getByRole("link", { name: "Konsultasi lewat form di beranda" })
      .click();

    await page.waitForURL(/\/\?estimasi=/);
    await expect(page.locator("#contact")).toBeVisible();
    await expect(
      page.getByRole("radio", { name: /Landing Page/ })
    ).toBeChecked();
    await expect(
      page.getByText("Mulai dari Rp 500.000", { exact: true })
    ).toBeVisible();
  });
});