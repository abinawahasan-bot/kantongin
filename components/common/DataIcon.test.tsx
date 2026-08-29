import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { DataIcon } from "./DataIcon";

describe("DataIcon", () => {
  it("merender ikon untuk nama icon values", () => {
    for (const name of ["badgeCheck", "barChart", "rocket", "trendingUp"]) {
      const { container } = render(<DataIcon name={name} className="size-6" />);
      expect(container.querySelector("svg")).not.toBeNull();
    }
  });

  it("merender ikon untuk nama icon services", () => {
    for (const name of [
      "shoppingCart",
      "layoutTemplate",
      "building2",
      "monitorSmartphone",
      "wrench",
    ]) {
      const { container } = render(<DataIcon name={name} className="size-6" />);
      expect(container.querySelector("svg")).not.toBeNull();
    }
  });

  it("nama tak dikenal dirender tanpa ikon", () => {
    const { container } = render(<DataIcon name="notARealIcon" />);
    expect(container.querySelector("svg")).toBeNull();
  });
});