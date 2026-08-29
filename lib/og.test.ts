import { describe, expect, it } from "vitest";
import { buildOgImageUrl } from "./og";

describe("buildOgImageUrl", () => {
  it("mengencode title dan diawali /og-image?", () => {
    expect(buildOgImageUrl("Paket & Harga")).toBe("/og-image?title=Paket+%26+Harga");
  });

  it("menyertakan subtitle bila ada", () => {
    expect(buildOgImageUrl("A", "B C")).toBe("/og-image?title=A&subtitle=B+C");
  });

  it("tidak menyertakan subtitle bila kosong", () => {
    expect(buildOgImageUrl("A")).not.toContain("subtitle");
  });
});