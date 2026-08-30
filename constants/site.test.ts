import { describe, expect, it } from "vitest";
import { siteConfig } from "./site";

describe("siteConfig", () => {
  it("brand tetap KantongIn dengan tagline & deskripsi pivot website", () => {
    expect(siteConfig.name).toBe("KantongIn");
    expect(siteConfig.tagline).toBe("Jasa Pembuatan Website Profesional");
    expect(siteConfig.description).toContain("pembuatan website");
  });

  it("url & whatsapp dipertahankan", () => {
    expect(siteConfig.url).toBe("https://kantongin-beige.vercel.app");
    expect(siteConfig.socials.whatsapp).toContain("wa.me/6285");
    expect(siteConfig.email).toBe("abinawahasan@gmail.com");
  });
});