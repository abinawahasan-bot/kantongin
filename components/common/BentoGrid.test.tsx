import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { BentoGrid, BentoItem } from "./BentoGrid";

describe("BentoGrid", () => {
  it("merender grid 6 kolom responsif", () => {
    const { container } = render(<BentoGrid>isi</BentoGrid>);
    expect(container.firstElementChild).toHaveClass("grid", "md:grid-cols-6");
  });

  it("menggabungkan className eksternal", () => {
    const { container } = render(<BentoGrid className="gap-6">isi</BentoGrid>);
    expect(container.firstElementChild).toHaveClass("gap-6");
  });
});

describe("BentoItem", () => {
  it("span default half = 3 kolom", () => {
    const { container } = render(<BentoItem>isi</BentoItem>);
    expect(container.firstElementChild).toHaveClass("md:col-span-3");
  });

  it.each([
    ["third", "md:col-span-2"],
    ["wide", "md:col-span-4"],
    ["full", "md:col-span-6"],
  ] as const)("span %s menerapkan %s", (span, expected) => {
    const { getByText } = render(<BentoItem span={span}>{span}</BentoItem>);
    expect(getByText(span)).toHaveClass(expected);
  });
});
