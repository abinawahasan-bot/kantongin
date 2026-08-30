import { describe, expect, it } from "vitest";
import { buildFaqSchema, faqs } from "./faqs";

describe("faqs (jasa pembuatan website)", () => {
  it("menyediakan 11 pertanyaan", () => {
    expect(faqs).toHaveLength(11);
  });

  it("pertanyaan pertama membahas lama pengerjaan", () => {
    expect(faqs[0].question).toMatch(/berapa lama/i);
  });

  it("mencakup topik domain & hosting", () => {
    const joined = faqs.map((f) => `${f.question} ${f.answer}`).join("\n");
    expect(joined).toMatch(/domain/i);
    expect(joined).toMatch(/hosting/i);
  });

  it("mencakup fakta bisnis nyata (pembayaran, kontrak, garansi, aset, seluruh Indonesia)", () => {
    const joined = faqs.map((f) => `${f.question} ${f.answer}`).join("\n");
    expect(joined).toMatch(/DP 50%/);
    expect(joined).toMatch(/pelunasan 50%/);
    expect(joined).toMatch(/kontrak tertulis/i);
    expect(joined).toMatch(/garansi perbaikan selama 1 bulan/i);
    expect(joined).toMatch(/100% milik Anda/i);
    expect(joined).toMatch(/seluruh Indonesia/i);
  });

  it("output JSON-LD memuat semua pertanyaan", () => {
    const schema = buildFaqSchema();
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(11);
  });
});