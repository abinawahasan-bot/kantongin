import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TrustedBy } from "./TrustedBy";

describe("TrustedBy", () => {
  it("merender semua partner sebagai chip pill berborder", () => {
    const { getAllByText } = render(<TrustedBy />);
    const chip = getAllByText("RumahKreasi")[0].closest("span")?.parentElement;
    expect(chip).toHaveClass("rounded-full", "border");
  });

  it("wrapper marquee memakai fade mask", () => {
    const { container } = render(<TrustedBy />);
    expect(container.querySelector(".marquee-fade")).not.toBeNull();
  });

  it("label eyebrow dirender", () => {
    const { getByText } = render(<TrustedBy />);
    expect(getByText(/Dipercaya oleh/i)).toBeInTheDocument();
  });

  it("menampilkan catatan bahwa nama partner bersifat ilustratif", () => {
    const { getByText } = render(<TrustedBy />);
    expect(getByText(/nama partner ilustratif/i)).toBeInTheDocument();
  });
});
