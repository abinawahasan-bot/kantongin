import { describe, expect, it } from "vitest";
import { estimateContactSchema } from "./forms";

const validPayload = {
  name: " Budi ",
  email: "budi@example.com",
  service: "company",
  addons: ["blog", "maintenance"],
  budget: "1to2m",
  message: "Pesan yang cukup panjang untuk lolos validasi.",
};

describe("estimateContactSchema", () => {
  it("menerima data valid dan memotong spasi", () => {
    const result = estimateContactSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Budi");
  });

  it("menolak pesan kurang dari 10 karakter", () => {
    expect(
      estimateContactSchema.safeParse({
        ...validPayload,
        message: "pendek",
      }).success
    ).toBe(false);
  });

  it("menolak layanan di luar daftar", () => {
    expect(
      estimateContactSchema.safeParse({
        ...validPayload,
        service: "tidak-ada",
      }).success
    ).toBe(false);
  });

  it("menolak email tidak valid", () => {
    expect(
      estimateContactSchema.safeParse({
        ...validPayload,
        email: "bukan-email",
      }).success
    ).toBe(false);
  });

  it("menolak budget di luar daftar", () => {
    expect(
      estimateContactSchema.safeParse({
        ...validPayload,
        budget: "tidak-ada",
      }).success
    ).toBe(false);
  });
});