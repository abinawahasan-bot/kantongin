import { beforeAll, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { ContactSection } from "./ContactSection";

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

describe("ContactSection", () => {
  it("menampilkan heading ajakan bicara proyek", () => {
    const { getByRole } = render(<ContactSection />);
    expect(
      getByRole("heading", { name: /Ayo bicarakan proyek Anda/ })
    ).toBeInTheDocument();
  });

  it("menampilkan catatan bahwa contoh proyek & testimoni bersifat ilustratif", () => {
    const { getByText } = render(<ContactSection />);
    expect(
      getByText(/contoh proyek & testimoni di halaman ini bersifat ilustratif/i)
    ).toBeInTheDocument();
  });
});