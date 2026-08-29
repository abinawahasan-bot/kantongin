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
      getByRole("heading", { name: /Semua Jenis Website/ })
    ).toBeInTheDocument();
  });

  it("merender flagship E-commerce dan layanan lainnya", () => {
    const { getByText } = render(<Services />);
    expect(getByText("E-commerce / Toko Online")).toBeInTheDocument();
    expect(getByText("Website Landing Page")).toBeInTheDocument();
    expect(getByText("Maintenance & Support")).toBeInTheDocument();
    expect(getByText(/solusi yang lebih spesifik/i)).toBeInTheDocument();
  });

  it("kartu flagship memakai span penuh bento", () => {
    const { getAllByText } = render(<Services />);
    const flagshipTitle = getAllByText("E-commerce / Toko Online")[0];
    const spanWrapper = flagshipTitle.closest('[class*="md:col-span-6"]');
    expect(spanWrapper).not.toBeNull();
  });

  it("indeks editorial dirender di tiap kartu", () => {
    const { getAllByText } = render(<Services />);
    expect(getAllByText("01").length).toBeGreaterThan(0);
    expect(getAllByText("05").length).toBeGreaterThan(0);
  });

  it("nomor flagship berada di atas ikon agar segaris dengan kartu grid", () => {
    const { getByText, container } = render(<Services />);
    const numberEl = getByText("01");
    const flagshipIcon = container.querySelector(".size-16");
    expect(flagshipIcon).not.toBeNull();
    expect(
      numberEl.compareDocumentPosition(flagshipIcon!) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });
});