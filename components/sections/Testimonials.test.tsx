import { describe, expect, it, vi, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import { Testimonials } from "./Testimonials";

beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

describe("Testimonials", () => {
  it("heading memakai tipografi display", () => {
    const { getByRole } = render(<Testimonials />);
    const heading = getByRole("heading", {
      name: /Kata Mereka Tentang KantongIn/,
    });
    expect(heading.className).toContain("clamp");
  });

  it("glyph kutip dekoratif memakai text-gradient", () => {
    const { container } = render(<Testimonials />);
    const glyph = container.querySelector(".text-gradient");
    expect(glyph).not.toBeNull();
    expect(glyph?.getAttribute("aria-hidden")).toBe("true");
  });

  it("deskripsi seksi memakai copy baru", () => {
    const { getByText } = render(<Testimonials />);
    expect(
      getByText(/bertumbuh bersama hasil kerja kami/i)
    ).toBeInTheDocument();
  });
});
