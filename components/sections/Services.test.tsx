import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { Services } from "./Services";

vi.mock("@/lib/lenis", () => ({
  useLenis: () => ({ scrollTo: vi.fn(), ready: true }),
}));

describe("Services", () => {
  it("merender heading baru", () => {
    const { getByRole } = render(<Services />);
    expect(
      getByRole("heading", { name: /Semua yang Brand Butuhkan/ })
    ).toBeInTheDocument();
  });

  it("merender ketujuh layanan dan kartu CTA custom", () => {
    const { getByText } = render(<Services />);
    expect(getByText("Affiliate Marketing")).toBeInTheDocument();
    expect(getByText("Content Production")).toBeInTheDocument();
    expect(getByText(/solusi yang lebih spesifik/i)).toBeInTheDocument();
  });

  it("kartu flagship memakai span penuh bento", () => {
    const { getAllByText } = render(<Services />);
    const flagshipTitle = getAllByText("Affiliate Marketing")[0];
    const spanWrapper = flagshipTitle.closest('[class*="md:col-span-6"]');
    expect(spanWrapper).not.toBeNull();
  });

  it("indeks editorial dirender di tiap kartu", () => {
    const { getAllByText } = render(<Services />);
    expect(getAllByText("01").length).toBeGreaterThan(0);
    expect(getAllByText("07").length).toBeGreaterThan(0);
  });
});
