import { describe, expect, it } from "vitest";
import {
  getRouteFromPathname,
  getScrollRatio,
  hasSeenPopup,
  markPopupSeen,
  POPUP_SCROLL_TRIGGER,
  shouldShowPopup,
} from "./conversion";

const fakeStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
  };
};

describe("getRouteFromPathname", () => {
  it("mengenali halaman layanan dan harga", () => {
    expect(getRouteFromPathname("/layanan")).toBe("layanan");
    expect(getRouteFromPathname("/harga")).toBe("harga");
  });

  it("mengenali halaman artikel blog (bukan index)", () => {
    expect(getRouteFromPathname("/blog/berapa-biaya-bikin-website")).toBe(
      "blog"
    );
    expect(getRouteFromPathname("/blog/abc/")).toBe("blog");
  });

  it("halaman lain tidak memicu popup", () => {
    expect(getRouteFromPathname("/")).toBe("none");
    expect(getRouteFromPathname("/blog")).toBe("none");
    expect(getRouteFromPathname("/blog/kategori/jasa-website")).toBe("none");
  });
});

describe("shouldShowPopup", () => {
  it("artikel blog tampil setelah scroll 60%", () => {
    expect(
      shouldShowPopup({
        route: "blog",
        scrollRatio: POPUP_SCROLL_TRIGGER,
        mouseLeftViewport: false,
        seen: false,
      })
    ).toBe(true);
  });

  it("artikel blog tidak tampil sebelum 60%", () => {
    expect(
      shouldShowPopup({
        route: "blog",
        scrollRatio: 0.59,
        mouseLeftViewport: false,
        seen: false,
      })
    ).toBe(false);
  });

  it("layanan dan harga tampil saat mouse keluar viewport", () => {
    for (const route of ["layanan", "harga"] as const) {
      expect(
        shouldShowPopup({
          route,
          scrollRatio: 0,
          mouseLeftViewport: true,
          seen: false,
        })
      ).toBe(true);
    }
  });

  it("layanan dan harga tidak tampil tanpa exit-intent", () => {
    expect(
      shouldShowPopup({
        route: "layanan",
        scrollRatio: 1,
        mouseLeftViewport: false,
        seen: false,
      })
    ).toBe(false);
  });

  it("tidak pernah tampil ulang dalam sesi yang sama", () => {
    expect(
      shouldShowPopup({
        route: "blog",
        scrollRatio: 1,
        mouseLeftViewport: true,
        seen: true,
      })
    ).toBe(false);
  });

  it("halaman non-popup selalu false", () => {
    expect(
      shouldShowPopup({
        route: "none",
        scrollRatio: 1,
        mouseLeftViewport: true,
        seen: false,
      })
    ).toBe(false);
  });
});

describe("getScrollRatio", () => {
  it("menghitung rasio scroll sederhana", () => {
    expect(getScrollRatio(750, 2000, 750)).toBe(0.6);
  });

  it("konten tanpa scroll dianggap selesai", () => {
    expect(getScrollRatio(0, 800, 800)).toBe(1);
  });

  it("membatasi rentang 0..1", () => {
    expect(getScrollRatio(-10, 2000, 750)).toBe(0);
    expect(getScrollRatio(5000, 2000, 750)).toBe(1);
  });
});

describe("sessionStorage popup", () => {
  it("menandai dan membaca status seen", () => {
    const storage = fakeStorage();
    expect(hasSeenPopup(storage)).toBe(false);
    markPopupSeen(storage);
    expect(hasSeenPopup(storage)).toBe(true);
    expect(hasSeenPopup(null)).toBe(false);
  });
});