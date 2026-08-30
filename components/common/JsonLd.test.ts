import { describe, expect, it } from "vitest";
import { siteConfig } from "@/constants/site";
import { buildBreadcrumbList, buildItemList, buildOrganizationSchema } from "./JsonLd";

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
  it("meng-emit email kontak yang terkonfigurasi", () => {
    expect(buildOrganizationSchema().email).toBe("abinawahasan@gmail.com");
  });
  it("tidak memuat aggregateRating", () => {
    expect(buildOrganizationSchema().aggregateRating).toBeUndefined();
  });
});

describe("buildBreadcrumbList", () => {
  it("membangun itemListElement 1-based dengan URL absolut", () => {
    const schema = buildBreadcrumbList([
      { name: "Beranda", url: "/" },
      { name: "Blog", url: "/blog" },
    ]);
    expect(schema["@type"]).toBe("BreadcrumbList");
    const elements = schema.itemListElement as Array<Record<string, unknown>>;
    expect(elements[0].position).toBe(1);
    expect(elements[0].item).toBe(`${siteConfig.url}/`);
    expect(elements[1].position).toBe(2);
    expect(elements[1].item).toBe(`${siteConfig.url}/blog`);
  });

  it("item terakhir tanpa properti item", () => {
    const schema = buildBreadcrumbList([
      { name: "Blog", url: "/blog" },
      { name: "Kategori", url: "/blog/kategori/jasa-website" },
      { name: "Judul Artikel" },
    ]);
    const elements = schema.itemListElement as Array<Record<string, unknown>>;
    expect(elements[0].item).toBe(`${siteConfig.url}/blog`);
    expect(elements[1].item).toBe(`${siteConfig.url}/blog/kategori/jasa-website`);
    expect(elements[2].position).toBe(3);
    expect(elements[2]).not.toHaveProperty("item");
  });

  it("itemListElement kosong bila tidak ada item", () => {
    expect(buildBreadcrumbList([]).itemListElement).toEqual([]);
  });
});

describe("buildItemList", () => {
  it("membangun ItemList dengan url absolut per item", () => {
    const schema = buildItemList([
      { name: "Artikel A", url: "/blog/a" },
      { name: "Artikel B", url: "/blog/b" },
    ]);
    expect(schema["@type"]).toBe("ItemList");
    const elements = schema.itemListElement as Array<Record<string, unknown>>;
    expect(elements[0]).toMatchObject({
      position: 1,
      name: "Artikel A",
      url: `${siteConfig.url}/blog/a`,
    });
    expect(elements[1].position).toBe(2);
    expect(elements[1].url).toBe(`${siteConfig.url}/blog/b`);
  });

  it("itemListElement kosong bila tidak ada item", () => {
    expect(buildItemList([]).itemListElement).toEqual([]);
  });
});