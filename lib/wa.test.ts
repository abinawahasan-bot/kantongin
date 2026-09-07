import { describe, expect, it } from "vitest";
import type { EstimateContactValues } from "@/lib/schemas/forms";
import {
  buildWhatsAppLink,
  estimateDirectMessage,
  estimateToWhatsAppMessage,
} from "./wa";

const estimateValues: EstimateContactValues = {
  name: "Budi Santoso",
  email: "budi@example.com",
  service: "company",
  addons: ["blog", "maintenance"],
  budget: "1to2m",
  message: "Saya butuh website untuk perusahaan konstruksi.",
};

describe("buildWhatsAppLink", () => {
  it("menghasilkan link wa.me dengan pesan ter-encode", () => {
    const link = buildWhatsAppLink("Halo!");
    expect(link.startsWith("https://wa.me/6285775149968?text=")).toBe(true);
    expect(decodeURIComponent(link)).toContain("text=Halo!");
  });
});

describe("estimateToWhatsAppMessage", () => {
  it("menyusun pesan terstruktur lengkap", () => {
    const message = estimateToWhatsAppMessage(estimateValues);
    expect(message).toContain("Halo KantongIn, saya ingin konsultasi pembuatan website!");
    expect(message).toContain("Nama: Budi Santoso");
    expect(message).toContain("Email: budi@example.com");
    expect(message).toContain("Jenis Layanan: Company Profile");
    expect(message).toContain("• Blog / Artikel (+Rp 150.000)");
    expect(message).toContain("• Maintenance & support (1 bulan) (+Rp 50.000)");
    expect(message).toContain("Estimasi awal: Mulai dari Rp 1.000.000");
    expect(message).toContain("Budget: Rp 1–2 juta");
    expect(message).toContain("Pesan: Saya butuh website untuk perusahaan konstruksi.");
    expect(message).toContain(
      "(angka estimasi & fitur dapat berubah setelah konsultasi scope)"
    );
  });

  it("menulis '-' untuk fitur tambahan kosong", () => {
    const message = estimateToWhatsAppMessage({
      name: "Sari",
      email: "sari@example.com",
      service: "landing",
      addons: [],
      budget: "undecided",
      message: "Mau bikin landing page produk baru.",
    });
    expect(message).toContain("Fitur tambahan: -");
    expect(message).toContain("Estimasi awal: Mulai dari Rp 300.000");
    expect(message).toContain("Budget: Belum tahu");  });

  it("menulis custom untuk add-on API tanpa harga", () => {
    const message = estimateToWhatsAppMessage({
      ...estimateValues,
      addons: ["api"],
    });
    expect(message).toContain("• Integrasi API / sistem (custom)");
    expect(message).toContain("Estimasi awal: Mulai dari Rp 800.000");
  });
});

describe("estimateDirectMessage", () => {
  it("menyusun pesan ringkas tanpa data kontak", () => {
    const message = estimateDirectMessage("company", ["blog", "maintenance"]);
    expect(message).toContain("Jenis Layanan: Company Profile");
    expect(message).toContain("• Blog / Artikel (+Rp 150.000)");
    expect(message).toContain("Estimasi awal: Mulai dari Rp 1.000.000");
    expect(message).not.toContain("Nama:");
    expect(message).not.toContain("Budget:");
  });

  it("menulis '-' untuk fitur tambahan kosong", () => {
    expect(estimateDirectMessage("landing", [])).toContain(
      "Fitur tambahan: -"
    );
  });
});