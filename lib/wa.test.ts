import { describe, expect, it } from "vitest";
import { buildWhatsAppLink, contactToWhatsAppMessage, waNumber } from "./wa";
import type { ContactValues } from "./schemas/forms";

describe("lib/wa", () => {
  it("mengekstrak nomor dari siteConfig.socials.whatsapp", () => {
    expect(waNumber()).toBe("6285775149968");
  });
  it("menyusun link wa.me dengan text ter-encode", () => {
    expect(buildWhatsAppLink("Halo & KantongIn+")).toBe(
      "https://wa.me/6285775149968?text=Halo%20%26%20KantongIn%2B"
    );
  });
  it("contactToWhatsAppMessage memuat semua field", () => {
    const values: ContactValues = {
      name: "Budi",
      email: "budi@example.com",
      service: "Landing Page",
      subject: "Proyek",
      message: "Saya ingin membuat landing page.",
    };
    const msg = contactToWhatsAppMessage(values);
    expect(msg).toContain("Nama: Budi");
    expect(msg).toContain("Email: budi@example.com");
    expect(msg).toContain("Jenis Layanan: Landing Page");
    expect(msg).toContain("Subjek: Proyek");
    expect(msg).toContain("Saya ingin membuat landing page.");
  });
});