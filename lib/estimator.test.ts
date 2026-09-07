import { describe, expect, it } from "vitest";
import {
  compareEstimateToBudget,
  computeEstimate,
  decodeEstimatePayload,
  encodeEstimatePayload,
  formatRp,
  getAddon,
  getBudget,
  getBudgetRange,
  getBudgetRecommendation,
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
    expect(getService("company")?.price).toBe(800_000);
    expect(getAddon("blog")?.price).toBe(150_000);
    expect(getBudget("1to2m")?.label).toBe("Rp 1–2 juta");
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
    expect(result.subtotal).toBe(300_000);
    expect(result.estimateLabel).toBe("Mulai dari Rp 300.000");
    expect(result.hasCustom).toBe(false);
    expect(result.addons).toEqual([]);
  });

  it("menjumlahkan semua add-on dengan harga", () => {
    const result = computeEstimate("company", ["blog", "maintenance"]);
    expect(result.subtotal).toBe(1_000_000);
    expect(result.estimateLabel).toBe("Mulai dari Rp 1.000.000");
    expect(result.hasCustom).toBe(false);
    expect(result.addons).toHaveLength(2);
  });

  it("menandai custom bila layanan bertipe custom", () => {
    const result = computeEstimate("webapp", []);
    expect(result.subtotal).toBe(2_000_000);
    expect(result.hasCustom).toBe(true);
  });

  it("menandai custom bila ada add-on tanpa harga (API)", () => {
    const result = computeEstimate("landing", ["api"]);
    expect(result.subtotal).toBe(300_000);
    expect(result.hasCustom).toBe(true);
  });

  it("mengabaikan id add-on yang tidak dikenal", () => {
    const result = computeEstimate("company", [
      "blog",
      "unknown" as never,
      "store",
    ]);
    expect(result.addons.map((a) => a.id)).toEqual(["blog", "store"]);
    expect(result.subtotal).toBe(1_850_000);
  });

  it("menghitung e-commerce dengan toko online & copywriting", () => {
    const result = computeEstimate("ecommerce", ["store", "copywriting"]);
    expect(result.subtotal).toBe(2_300_000);
  });
});

describe("encode / decode payload", () => {
  it("roundtrip payload yang valid", () => {
    const payload: EstimatePayload = {
      s: "company",
      a: ["blog", "maintenance"],
      b: "1to2m",
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

describe("getBudgetRange", () => {
  it("mengembalikan rentang nominal per budget", () => {
    expect(getBudgetRange("below500k")).toEqual({ min: 0, max: 500_000 });
    expect(getBudgetRange("1to2m")).toEqual({ min: 1_000_000, max: 2_000_000 });
    expect(getBudgetRange("2to5m")).toEqual({ min: 2_000_000, max: 5_000_000 });
    expect(getBudgetRange("above5m")).toEqual({ min: 5_000_000, max: 8_000_000 });
    expect(getBudgetRange("above10m")).toEqual({ min: 8_000_000, max: null });
  });

  it("mengembalikan null untuk budget belum tahu", () => {
    expect(getBudgetRange("undecided")).toBeNull();
  });
});

describe("compareEstimateToBudget", () => {
  it("menandai di dalam budget", () => {
    const result = compareEstimateToBudget(1_000_000, "1to2m");
    expect(result.status).toBe("under");
  });

  it("menandai dekat batas atas budget", () => {
    const result = compareEstimateToBudget(1_900_000, "1to2m");
    expect(result.status).toBe("near");
  });

  it("menandai melebihi budget", () => {
    const result = compareEstimateToBudget(3_000_000, "1to2m");
    expect(result.status).toBe("over");
  });

  it("tidak menilai untuk budget belum tahu", () => {
    const result = compareEstimateToBudget(1_000_000, "undecided");
    expect(result.status).toBe("none");
  });

  it("tidak menilai untuk budget tanpa batas atas", () => {
    expect(compareEstimateToBudget(50_000_000, "above10m").status).toBe("none");
  });

  it("menilai budget 5–8 juta dengan batas atas", () => {
    expect(compareEstimateToBudget(6_000_000, "above5m").status).toBe("under");
    expect(compareEstimateToBudget(9_000_000, "above5m").status).toBe("over");
  });
});

describe("getBudgetRecommendation", () => {
  it("merekomendasikan layanan sesuai budget", () => {
    expect(getBudgetRecommendation("below500k")?.serviceId).toBe("landing");
    expect(getBudgetRecommendation("1to2m")?.serviceId).toBe("company");
    expect(getBudgetRecommendation("2to5m")?.serviceId).toBe("ecommerce");
    expect(getBudgetRecommendation("above5m")?.serviceId).toBe("webapp");
  });

  it("merekomendasikan paket lengkap untuk budget >10 juta", () => {
    const rec = getBudgetRecommendation("above10m");
    expect(rec?.serviceId).toBe("webapp");
    expect(rec?.addonIds).toEqual([
      "blog",
      "store",
      "copywriting",
      "maintenance",
      "api",
    ]);
  });

  it("memberi rekomendasi default untuk budget belum tahu", () => {
    expect(getBudgetRecommendation("undecided")?.serviceId).toBe("landing");
  });
});