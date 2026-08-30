import { describe, expect, it } from "vitest";
import { isSectionHref, resolveNavHref } from "./nav";

describe("isSectionHref", () => {
  it("mengenali href anchor section", () => {
    expect(isSectionHref("#services")).toBe(true);
    expect(isSectionHref("#how-it-works")).toBe(true);
  });

  it("menolak rute dan hash kosong", () => {
    expect(isSectionHref("/harga")).toBe(false);
    expect(isSectionHref("/")).toBe(false);
    expect(isSectionHref("#")).toBe(false);
  });
});

describe("resolveNavHref", () => {
  it("anchor section tetap polos saat sudah di beranda", () => {
    expect(resolveNavHref("/", "#services")).toBe("#services");
    expect(resolveNavHref("/", "/harga")).toBe("/harga");
  });

  it("anchor section menjadi deep-link beranda saat di halaman lain", () => {
    expect(resolveNavHref("/harga", "#services")).toBe("/#services");
    expect(resolveNavHref("/blog/abc", "#portfolio")).toBe("/#portfolio");
  });

  it("rute internal tidak diubah", () => {
    expect(resolveNavHref("/harga", "/tentang-kami")).toBe("/tentang-kami");
    expect(resolveNavHref("/harga", "/blog")).toBe("/blog");
  });
});