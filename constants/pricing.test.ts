import { describe, expect, it } from "vitest";
import { pricingPlans } from "./pricing";
import { estimatorServices } from "@/lib/estimator";

describe("pricingPlans (paket jasa pembuatan website)", () => {
  it("menyediakan 4 paket yang selaras dengan layanan estimator", () => {
    expect(pricingPlans.map((plan) => plan.name)).toEqual([
      "Landing Page",
      "Company Profile",
      "E-commerce / Toko Online",
      "Custom / Web App",
    ]);
  });

  it("harga hybrid sekali bayar tanpa period", () => {
    expect(pricingPlans[0].price).toBe("Rp 300 rb");
    expect(pricingPlans[1].price).toBe("Rp 800 rb");
    expect(pricingPlans[2].price).toBe("Rp 1,3 jt");
    expect(pricingPlans[3].price).toBe("Custom");
    for (const plan of pricingPlans) {
      expect(plan.period).toBeUndefined();
    }
  });

  it("paket Company Profile ditandai highlight", () => {
    expect(pricingPlans[1].highlight).toBe(true);
    expect(pricingPlans[0].highlight).toBe(false);
    expect(pricingPlans[2].highlight).toBe(false);
    expect(pricingPlans[3].highlight).toBe(false);
  });

  it("setiap paket memiliki ikon terdaftar", () => {
    const known = ["rocket", "building2", "shoppingBag", "layoutDashboard"];
    for (const plan of pricingPlans) {
      expect(known).toContain(plan.icon);
    }
  });

  it("semua paket memiliki jumlah fitur yang sama agar kartu rata", () => {
    const counts = pricingPlans.map((plan) => plan.features.length);
    expect(new Set(counts).size).toBe(1);
    expect(counts[0]).toBe(5);
  });

  it("harga paket konsisten dengan estimator", () => {
    const byId = (id: string) =>
      estimatorServices.find((service) => service.id === id);

    expect(pricingPlans[0].price).toBe("Rp 300 rb");
    expect(byId("landing")?.price).toBe(300_000);

    expect(pricingPlans[1].price).toBe("Rp 800 rb");
    expect(byId("company")?.price).toBe(800_000);

    expect(pricingPlans[2].price).toBe("Rp 1,3 jt");
    expect(byId("ecommerce")?.price).toBe(1_300_000);
  });
});