import { describe, expect, it } from "vitest";
import { pricingPlans } from "./pricing";

describe("pricingPlans (paket jasa pembuatan website)", () => {
  it("menyediakan 3 paket dengan nama baru", () => {
    expect(pricingPlans.map((plan) => plan.name)).toEqual([
      "Landing Page",
      "Company Profile",
      "Custom / Web App",
    ]);
  });

  it("harga hybrid sekali bayar tanpa period", () => {
    expect(pricingPlans[0].price).toBe("Rp 500 rb");
    expect(pricingPlans[1].price).toBe("Rp 1,3 jt");
    expect(pricingPlans[2].price).toBe("Custom");
    for (const plan of pricingPlans) {
      expect(plan.period).toBeUndefined();
    }
  });

  it("paket Company Profile ditandai highlight", () => {
    expect(pricingPlans[1].highlight).toBe(true);
    expect(pricingPlans[0].highlight).toBe(false);
    expect(pricingPlans[2].highlight).toBe(false);
  });
});