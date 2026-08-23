import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Statistics } from "./Statistics";

describe("Statistics", () => {
  it("merender heading seksi", () => {
    const { getByRole } = render(<Statistics />);
    expect(
      getByRole("heading", { name: /Hasil Nyata, Bukan Janji/ })
    ).toBeInTheDocument();
  });

  it("merender keempat statistik pendukung", () => {
    const { getByText } = render(<Statistics />);
    for (const label of [
      "Kampanye Berjalan",
      "Brand & UMKM",
      "Kreator Bergabung",
      "Affiliates Aktif",
    ]) {
      expect(getByText(label)).toBeInTheDocument();
    }
  });

  it("featured stat memakai gradient dan glow card", () => {
    const { getByText } = render(<Statistics />);
    const featured = getByText("Komisi Disalurkan").closest("div");
    expect(featured?.querySelector(".text-gradient")).not.toBeNull();
    expect(featured?.closest(".rounded-2xl")).not.toBeNull();
  });
});
