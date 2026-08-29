import { describe, expect, it } from "vitest";
import {
  computeEstimate,
  decodeEstimatePayload,
  encodeEstimatePayload,
  formatRp,
  getAddon,
  getBudget,
  getService,
  type EstimatePayload,
} from "./estimator";

describe("formatRp", () => {
  it("memformat angka menjadi Rupiah dengan pemisah ribuan", () => {
    expect(formatRp(500_000)).toBe("Rp 500.000");
    expect(formatRp(1_750_000)).toBe("Rp 1.750.000");
    expect(formatRp(5_000_000)).toBe("Rp 5.000.000");
  });
});

describe("getService / getAddon / getBudget", () => {
  it("mengembalikan entri yang dikenal", () => {
    expect(getService("company")?.price).toBe(1_300_000);
    expect(getAddon("blog")?.price).toBe(300_000);
    expect(getBudget("1to3m")?.label).toBe("Rp 1–3 juta");
  });

  it("mengembalikan undefined untuk id tak dikenal", () => {
    expect(getService("unknown" as never)).toBeUndefined();
    expect(getAddon("unknown" as never)).toBeUndefined();
    expect(getBudget("unknown" as never)).toBeUndefined();
  });
});

describe("computeEstimate", () => {
  it("menghitung satu jenis tanpa add-on", () => {
    const result = computeEstimate("landing", []);
    expect(result.subtotal).toBe(500_000);
    expect(result.estimateLabel).toBe("Mulai dari Rp 500.000");
    expect(result.hasCustom).toBe(false);
    expect(result.addons).toEqual([]);
  });

  it("menjumlahkan semua add-on dengan harga", () => {
    const result = computeEstimate("company", ["blog", "maintenance"]);
    expect(result.subtotal).toBe(1_750_000);
    expect(result.estimateLabel).toBe("Mulai dari Rp 1.750.000");
    expect(result.hasCustom).toBe(false);
    expect(result.addons).toHaveLength(2);
  });

  it("menandai custom bila layanan bertipe custom", () => {
    const result = computeEstimate("webapp", []);
    expect(result.subtotal).toBe(5_000_000);
    expect(result.hasCustom).toBe(true);
  });

  it("menandai custom bila ada add-on tanpa harga (API)", () => {
    const result = computeEstimate("landing", ["api"]);
    expect(result.subtotal).toBe(500_000);
    expect(result.hasCustom).toBe(true);
  });

  it("mengabaikan id add-on yang tidak dikenal", () => {
    const result = computeEstimate("company", [
      "blog",
      "unknown" as never,
      "store",
    ]);
    expect(result.addons.map((a) => a.id)).toEqual(["blog", "store"]);
    expect(result.subtotal).toBe(3_100_000);
  });

  it("menghitung e-commerce dengan toko online & copywriting", () => {
    const result = computeEstimate("ecommerce", ["store", "copywriting"]);
    expect(result.subtotal).toBe(4_250_000);
  });
});

describe("encode / decode payload", () => {
  it("roundtrip payload yang valid", () => {
    const payload: EstimatePayload = {
      s: "company",
      a: ["blog", "maintenance"],
      b: "1to3m",
    };
    expect(
      decodeEstimatePayload(encodeEstimatePayload(payload))
    ).toEqual(payload);
  });

  it("mengembalikan null untuk nilai kosong", () => {
    expect(decodeEstimatePayload(null)).toBeNull();
    expect(decodeEstimatePayload("")).toBeNull();
  });

  it("mengembalikan null untuk JSON tidak valid", () => {
    expect(decodeEstimatePayload("not-json")).toBeNull();
  });

  it("mengembalikan null untuk bentuk yang salah", () => {
    expect(decodeEstimatePayload(JSON.stringify({ foo: 1 }))).toBeNull();
    expect(
      decodeEstimatePayload(JSON.stringify({ s: "nope", a: [], b: "x" }))
    ).toBeNull();
    expect(decodeEstimatePayload(JSON.stringify([1, 2]))).toBeNull();
  });

  it("menyaring addon tak dikenal saat decode", () => {
    const decoded = decodeEstimatePayload(
      JSON.stringify({ s: "landing", a: ["blog", "bogus"], b: "undecided" })
    );
    expect(decoded?.a).toEqual(["blog"]);
  });
});