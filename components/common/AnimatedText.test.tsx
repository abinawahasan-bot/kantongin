import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { AnimatedText } from "./AnimatedText";

describe("AnimatedText highlight", () => {
  it("memberi text-gradient hanya pada kata frasa highlight", () => {
    const { getByLabelText } = render(
      <div>
        <AnimatedText
          text="Tumbuhkan Penjualan Kreator Terkurasi"
          highlight="Kreator Terkurasi"
        />
      </div>
    );
    const root = getByLabelText("Tumbuhkan Penjualan Kreator Terkurasi");
    const words = Array.from(
      root.querySelectorAll<HTMLElement>("span[aria-hidden]")
    );
    const highlighted = words.filter(
      (w) =>
        w.textContent?.trim() !== "" &&
        w.querySelector(".text-gradient") !== null
    );
    const plain = words.filter(
      (w) =>
        w.textContent?.trim() !== "" &&
        w.querySelector(".text-gradient") === null
    );
    expect(highlighted.map((w) => w.textContent?.trim())).toEqual([
      "Kreator",
      "Terkurasi",
    ]);
    expect(plain.length).toBeGreaterThan(0);
  });

  it("tanpa highlight tidak ada text-gradient", () => {
    const { container } = render(<AnimatedText text="Kalimat Biasa Saja" />);
    expect(container.querySelectorAll(".text-gradient")).toHaveLength(0);
  });

  it("memberi bleed vertikal pada kotak klip kata agar descender tidak terpotong", () => {
    const { container } = render(<AnimatedText text="Tumbuhkan Penjualan" />);
    const wrappers = Array.from(
      container.querySelectorAll<HTMLElement>(
        "span.inline-block.overflow-hidden"
      )
    );
    expect(wrappers.length).toBeGreaterThan(0);
    for (const wrapper of wrappers) {
      expect(wrapper.className).toContain("py-[0.12em]");
      expect(wrapper.className).toContain("-my-[0.12em]");
    }
  });
});
