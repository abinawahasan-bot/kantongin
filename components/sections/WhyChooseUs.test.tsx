import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { WhyChooseUs } from "./WhyChooseUs";

describe("WhyChooseUs", () => {
  it("heading memakai tipografi display", () => {
    const { getByRole } = render(<WhyChooseUs />);
    const heading = getByRole("heading", { name: /Mengapa Brand Memilih Kami/ });
    expect(heading.className).toContain("clamp");
  });
});
