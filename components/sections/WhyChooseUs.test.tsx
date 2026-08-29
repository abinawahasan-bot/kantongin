import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { WhyChooseUs } from "./WhyChooseUs";

import { values } from "@/constants/values";

describe("WhyChooseUs", () => {
  it("merender heading untuk jasa pembuatan website", () => {
    const { getByRole } = render(<WhyChooseUs />);
    expect(
      getByRole("heading", { name: /Mengapa Klien Memilih Kami/ })
    ).toBeInTheDocument();
  });

  it("menampilkan 4 nilai jual baru", () => {
    const titles = values.map((v) => v.title);
    expect(titles).toEqual([
      "Design Modern & Responsif",
      "Fast & SEO-Ready",
      "Proses Transparan & Tepat Waktu",
      "Support & Maintenance",
    ]);
    expect(values).toHaveLength(4);
  });
});