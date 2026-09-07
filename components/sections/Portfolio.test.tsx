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
      getByRole("heading", { name: /Karya Website yang Sudah Meluncur/ })
    ).toBeInTheDocument();
    expect(getByText("Semua")).toBeInTheDocument();
  });

  it("hasil kampanye dirender sebagai chip gradien persisten di luar overlay hover", () => {
    const { getByText } = render(<Portfolio />);
    const chip = getByText(projects[0].result);
    expect(chip.closest('[class*="md:opacity-0"]')).toBeNull();
    expect(chip.closest('[class*="opacity-0"]')).toBeNull();
    expect(chip.closest('[class*="bg-gradient-to-r"]')).not.toBeNull();
  });

  it("proyek yang ditandai featured dirender lebih lebar (col-span-2)", () => {
    const { getByLabelText } = render(<Portfolio />);
    const featured = projects.filter((p) => p.featured);
    expect(featured.length).toBeGreaterThan(0);
    for (const project of featured) {
      const card = getByLabelText(`Lihat detail proyek ${project.title}`);
      expect(card.className).toContain("md:col-span-2");
    }
  });

  it("membuka dialog detail berisi metrics saat tombol detail diklik", () => {
    const { getByLabelText, getByText } = render(<Portfolio />);
    fireEvent.click(getByLabelText(`Lihat detail proyek ${projects[0].title}`));
    expect(
      getByText(/katalog produk, keranjang belanja/i)
    ).toBeInTheDocument();
    expect(getByText("+2x")).toBeInTheDocument();
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

  it("tiap foto proyek dirender dalam pembungkus berisi penuh (h-full)", () => {
    const { getAllByRole } = render(<Portfolio />);
    const images = getAllByRole("img").slice(0, projects.length);
    for (const img of images) {
      expect(
        img.closest('[class*="h-full"]'),
        "foto proyek harus membungkus h-full agar terlihat di kartu"
      ).not.toBeNull();
    }
  });

  it("menampilkan catatan bahwa contoh proyek bersifat ilustratif", () => {
    const { getByText } = render(<Portfolio />);
    expect(
      getByText(/contoh proyek ini ilustratif/i)
    ).toBeInTheDocument();
  });
});
