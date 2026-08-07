import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { SocialIcon } from "./SocialIcon";

describe("SocialIcon", () => {
  it("merender SVG dengan path yang sesuai", () => {
    const { container } = render(<SocialIcon name="instagram" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelector("path")).toHaveAttribute("d");
  });

  it("menggabungkan className eksternal", () => {
    const { container } = render(<SocialIcon name="tiktok" className="size-5" />);
    expect(container.querySelector("svg")).toHaveClass("size-5");
  });
});
