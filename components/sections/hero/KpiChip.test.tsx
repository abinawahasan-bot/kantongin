import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { KpiChip } from "./KpiChip";

describe("KpiChip", () => {
  it("merender nilai dan label serta tidak dapat di-hover/diklik", () => {
    const { getByText } = render(<KpiChip value="+214%" label="Rata-rata ROI" />);
    expect(getByText("+214%")).toBeInTheDocument();
    expect(getByText("Rata-rata ROI")).toBeInTheDocument();
    const chip = getByText("+214%").closest("div");
    expect(chip).toHaveClass("pointer-events-none");
  });

  it("menggabungkan className eksternal untuk posisi", () => {
    const { getByText } = render(
      <KpiChip value="850+" label="Kreator" className="left-0 top-10" />
    );
    const chip = getByText("850+").closest("div");
    expect(chip).toHaveClass("left-0", "top-10");
  });
});
