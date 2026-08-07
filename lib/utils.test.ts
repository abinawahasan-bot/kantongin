import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("menggabungkan kelas", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("mengabaikan nilai falsy", () => {
    expect(cn("px-4", false, null, undefined, "py-2")).toBe("px-4 py-2");
  });

  it("menyelesaikan konflik tailwind dengan tailwind-merge", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });

  it("mengembalikan string kosong tanpa argumen", () => {
    expect(cn()).toBe("");
  });
});
