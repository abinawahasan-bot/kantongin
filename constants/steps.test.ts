import { describe, expect, it } from "vitest";
import { flows } from "./steps";

describe("steps (alur jasa pembuatan website)", () => {
  it("mempertahankan id, label, dan anchor flows", () => {
    expect(flows.map((f) => f.id)).toEqual(["brand", "creator"]);
    expect(flows.map((f) => f.label)).toEqual([
      "Website Baru",
      "Maintenance & Support",
    ]);
    expect(flows.map((f) => f.anchorId)).toEqual(["affiliate", "creators"]);
  });

  it("setiap flow memiliki 4 langkah", () => {
    for (const flow of flows) {
      expect(flow.steps).toHaveLength(4);
    }
  });

  it("alur pertama berisi langkah pembuatan website", () => {
    const titles = flows[0].steps.map((s) => s.title);
    expect(titles).toContain("Konsultasi");
    expect(titles).toContain("Desain & Development");
    expect(titles).toContain("Review & Peluncuran");
  });
});