import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { DashboardMockup } from "./DashboardMockup";

describe("DashboardMockup (studio)", () => {
  it("menampilkan judul studio dan panel proyek & performa", () => {
    const { getByText } = render(<DashboardMockup />);
    expect(getByText(/kantongin • studio/i)).toBeInTheDocument();
    expect(getByText("Proyek Aktif")).toBeInTheDocument();
    expect(getByText("Performa Website")).toBeInTheDocument();
  });
});