import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { SectionHeading } from "./SectionHeading";

describe("SectionHeading", () => {
  it("ukuran default memakai kelas tipografi standar", () => {
    const { container } = render(<SectionHeading title="Judul Seksi" />);
    const heading = container.querySelector("h2");
    expect(heading).toHaveClass("text-3xl");
    expect(heading?.className).not.toContain("clamp");
  });

  it("size display memakai tipografi besar", () => {
    const { container } = render(
      <SectionHeading title="Judul Besar" size="display" />
    );
    const heading = container.querySelector("h2");
    expect(heading?.className).toContain("clamp");
    expect(heading).toHaveClass("leading-[1.05]");
  });
});
