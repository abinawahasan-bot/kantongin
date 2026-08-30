import { describe, expect, it, vi } from "vitest";
import {
  MAX_CUSTOM_PROPERTIES,
  normalizePayload,
  trackConversion,
  type ConversionPayload,
} from "./analytics";

vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}));

import { track } from "@vercel/analytics";

describe("normalizePayload", () => {
  it("mengembalikan objek kosong untuk payload kosong", () => {
    expect(normalizePayload()).toEqual({});
    expect(normalizePayload(undefined)).toEqual({});
  });

  it("membatasi maksimal 2 properti", () => {
    const result = normalizePayload({ a: "1", b: "2", c: "3" });
    expect(Object.keys(result)).toHaveLength(MAX_CUSTOM_PROPERTIES);
  });

  it("menyaring nilai non-primitif", () => {
    const result = normalizePayload({
      ok: "ya",
      obj: { x: 1 },
      arr: [1],
    } as unknown as ConversionPayload);
    expect(result).toEqual({ ok: "ya" });
  });

  it("mempertahankan primitif null/number/boolean", () => {
    const result = normalizePayload({ a: null, b: 2, c: true, d: "x" });
    expect(result).toEqual({ a: null, b: 2 });
  });
});

describe("trackConversion", () => {
  it("tidak mengirim saat window tidak tersedia (server)", () => {
    vi.stubGlobal("window", undefined);
    trackConversion("cta_whatsapp_click", { section: "hero" });
    expect(track).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("mengirim event dengan payload ternormalisasi (client)", () => {
    vi.stubGlobal("window", {});
    trackConversion("estimator_submit", { halaman: "harga", extra: 1, ok: true });
    expect(track).toHaveBeenCalledWith(
      "estimator_submit",
      expect.objectContaining({ halaman: "harga", extra: 1 })
    );
    vi.unstubAllGlobals();
  });
});