import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

vi.mock("@/lib/lenis", () => ({
  useLenis: () => ({ ready: true, scrollTo: vi.fn(), stop: vi.fn(), start: vi.fn() }),
}));

describe("Footer", () => {
  it("menampilkan blok Ikuti Kami beserta tautan media sosial", () => {
    render(<Footer />);
    expect(screen.getByRole("heading", { name: "Ikuti Kami" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      "https://instagram.com/kantonginofc"
    );
    expect(screen.getByRole("link", { name: "TikTok" })).toHaveAttribute(
      "href",
      "https://tiktok.com/@kantonginofc"
    );
    expect(
      screen.getByLabelText(/KantongIn di instagram/i)
    ).toHaveAttribute("href", "https://instagram.com/kantonginofc");
  });

  it("tautan WhatsApp prefilled berisi pesan konsultasi", () => {
    render(<Footer />);
    const waLink = screen.getByRole("link", { name: "WhatsApp" });
    expect(waLink.getAttribute("href")).toContain(
      "https://wa.me/6285775149968?text="
    );
    expect(waLink.getAttribute("href")).toContain(
      encodeURIComponent("saya ingin konsultasi pembuatan website")
    );
  });

  it("tidak lagi menampilkan form newsletter", () => {
    render(<Footer />);
    expect(
      screen.queryByLabelText("Alamat email untuk newsletter")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Berlangganan/i })
    ).not.toBeInTheDocument();
  });

  it("menyediakan tautan halaman layanan & tentang kami", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Semua Layanan" })).toHaveAttribute(
      "href",
      "/layanan"
    );
    expect(screen.getByRole("link", { name: "Tentang Kami" })).toHaveAttribute(
      "href",
      "/tentang-kami"
    );
  });
});