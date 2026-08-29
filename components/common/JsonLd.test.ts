import { describe, expect, it } from "vitest";
import { buildOrganizationSchema } from "./JsonLd";

describe("buildOrganizationSchema", () => {
  it("bertipe Organization dan ProfessionalService", () => {
    const schema = buildOrganizationSchema();
    expect(schema["@type"]).toEqual(["Organization", "ProfessionalService"]);
  });
  it("memuat priceRange dan areaServed", () => {
    const { priceRange, areaServed } = buildOrganizationSchema();
    expect(priceRange).toBe("Rp 500 rb - custom");
    expect(areaServed).toBe("ID");
  });
  it("memuat contactPoint WhatsApp", () => {
    const contactPoint = buildOrganizationSchema().contactPoint as Record<
      string,
      unknown
    >;
    expect(contactPoint.telephone).toBe("+6285775149968");
    expect(contactPoint.contactType).toBe("sales");
  });
  it("tidak meng-emit email saat kosong", () => {
    expect(buildOrganizationSchema().email).toBeUndefined();
  });
  it("tidak memuat aggregateRating", () => {
    expect(buildOrganizationSchema().aggregateRating).toBeUndefined();
  });
});