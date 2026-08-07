import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Footer } from "./Footer";

vi.mock("@/lib/lenis", () => ({
  useLenis: () => ({ ready: true, scrollTo: vi.fn(), stop: vi.fn(), start: vi.fn() }),
}));

const fetchMock = vi.fn();

describe("Footer NewsletterForm", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("menampilkan form dan tautan sosial", () => {
    render(<Footer />);
    expect(
      screen.getByLabelText("Alamat email untuk newsletter")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Berlangganan/i })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/KantongIn di instagram/i)
    ).toHaveAttribute(
      "href",
      "https://instagram.com/kantonginofc"
    );
  });

  it("menampilkan pesan validasi untuk email kosong", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    await user.click(screen.getByRole("button", { name: /Berlangganan/i }));
    expect(await screen.findByText("Masukkan email yang valid")).toBeInTheDocument();
  });

  it("mengirim email ke API dan menampilkan pesan sukses", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<Footer />);
    await user.type(
      screen.getByLabelText("Alamat email untuk newsletter"),
      "user@example.com"
    );
    await user.click(screen.getByRole("button", { name: /Berlangganan/i }));

    expect(await screen.findByText(/Terima kasih/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/newsletter",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "user@example.com" }),
      })
    );
  });

  it("menampilkan pesan error saat API menolak", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Terlalu banyak permintaan, coba lagi nanti." }),
    });

    render(<Footer />);
    await user.type(
      screen.getByLabelText("Alamat email untuk newsletter"),
      "user@example.com"
    );
    await user.click(screen.getByRole("button", { name: /Berlangganan/i }));

    expect(
      await screen.findByText("Terlalu banyak permintaan, coba lagi nanti.")
    ).toBeInTheDocument();
  });
});
