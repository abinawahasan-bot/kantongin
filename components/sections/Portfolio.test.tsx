import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { Portfolio } from "./Portfolio";
import { projects } from "@/constants/portfolio";

vi.mock("@/lib/lenis", () => ({
  useLenis: () => ({ scrollTo: vi.fn(), ready: true }),
}));

describe("Portfolio", () => {
  it("merender heading seksi dan filter kategori", () => {
    const { getByRole, getByText } = render(<Portfolio />);
    expect(
      getByRole("heading", { name: /Hasil Nyata, Kampanye Terukur/ })
    ).toBeInTheDocument();
    expect(getByText("Semua")).toBeInTheDocument();
  });

  it("hasil kampanye dirender sebagai chip persisten di luar overlay hover", () => {
    const { getByText } = render(<Portfolio />);
    const chip = getByText(projects[0].result);
    expect(chip.closest('[class*="md:opacity-0"]')).toBeNull();
    expect(chip.closest(".backdrop-blur-sm")).not.toBeNull();
  });

  it("membuka dialog detail berisi metrics saat tombol detail diklik", () => {
    const { getByLabelText, getByText } = render(<Portfolio />);
    fireEvent.click(getByLabelText(`Lihat detail proyek ${projects[0].title}`));
    expect(
      getByText(/jaringan affiliate kami meluncurkan promo/i)
    ).toBeInTheDocument();
    expect(getByText("Rp 4,2 M")).toBeInTheDocument();
  });

  it("tiap proyek menampilkan foto kontekstual dengan alt deskriptif", () => {
    const { getAllByRole } = render(<Portfolio />);
    const images = getAllByRole("img");
    expect(images).toHaveLength(projects.length);
    for (const project of projects) {
      const { image, imageAlt } = project as typeof project & {
        image?: string;
        imageAlt?: string;
      };
      expect(image, `field image kosong pada ${project.id}`).toBeDefined();
      expect(
        imageAlt,
        `field imageAlt kosong pada ${project.id}`
      ).toBeDefined();
      const img = images.find((el) =>
        decodeURIComponent(el.getAttribute("src") ?? "").includes(image!)
      );
      expect(img, `foto tidak dirender untuk ${project.id}`).toBeDefined();
      expect(img!.getAttribute("alt")).toBe(imageAlt);
    }
  });
});
