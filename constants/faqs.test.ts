import { describe, expect, it } from "vitest";
import { faqs } from "./faqs";

describe("faqs (jasa pembuatan website)", () => {
  it("menyediakan setidaknya 7 pertanyaan", () => {
    expect(faqs.length).toBeGreaterThanOrEqual(7);
  });

  it("pertanyaan pertama membahas lama pengerjaan", () => {
    expect(faqs[0].question).toMatch(/berapa lama/i);
  });

  it("mencakup topik domain & hosting", () => {
    const joined = faqs.map((f) => `${f.question} ${f.answer}`).join("\n");
    expect(joined).toMatch(/domain/i);
    expect(joined).toMatch(/hosting/i);
  });
});