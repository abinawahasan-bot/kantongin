import { describe, expect, it } from "vitest";
import { contactSchema, newsletterSchema } from "./forms";

describe("contactSchema", () => {
  it("menerima data valid dan memotong spasi", () => {
    const result = contactSchema.safeParse({
      name: " Budi ",
      email: "budi@example.com",
      service: "Company Profile",
      subject: "Halo",
      message: "Pesan yang cukup panjang untuk lolos validasi.",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Budi");
  });

  it("menolak pesan kurang dari 10 karakter", () => {
    expect(
      contactSchema.safeParse({ name: "Budi", email: "budi@example.com", service: "Company Profile", subject: "Halo", message: "pendek" }).success
    ).toBe(false);
  });

  it("menolak data tanpa jenis layanan", () => {
    const result = contactSchema.safeParse({
      name: "Budi",
      email: "budi@example.com",
      subject: "Halo",
      message: "Pesan yang cukup panjang untuk lolos validasi.",
    });
    expect(result.success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("menolak email tidak valid", () => {
    expect(newsletterSchema.safeParse({ email: "bukan-email" }).success).toBe(false);
  });

  it("menerima email valid", () => {
    expect(newsletterSchema.safeParse({ email: "budi@example.com" }).success).toBe(true);
  });

  it("memotong spasi di sekitar email", () => {
    const result = newsletterSchema.safeParse({ email: " budi@example.com " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("budi@example.com");
  });
});
