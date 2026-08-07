import { describe, expect, it, vi, beforeEach } from "vitest";
import { getClientIp, rateLimitByIp } from "./rate-limit";

describe("rateLimitByIp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("mengizinkan permintaan pertama", () => {
    expect(rateLimitByIp("a", 3, 1000)).toEqual({ ok: true });
  });

  it("menolak setelah melewati batas", () => {
    rateLimitByIp("b", 3, 1000);
    rateLimitByIp("b", 3, 1000);
    rateLimitByIp("b", 3, 1000);
    const result = rateLimitByIp("b", 3, 1000);
    expect(result.ok).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it("mengisi ulang bucket setelah window berlalu", () => {
    rateLimitByIp("c", 1, 1000);
    expect(rateLimitByIp("c", 1, 1000).ok).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(rateLimitByIp("c", 1, 1000).ok).toBe(true);
  });

  it("menghitung key per IP secara terpisah", () => {
    rateLimitByIp("d", 1, 1000);
    expect(rateLimitByIp("d", 1, 1000).ok).toBe(false);
    expect(rateLimitByIp("e", 1, 1000).ok).toBe(true);
  });
});

describe("getClientIp", () => {
  it("mengambil IP pertama dari x-forwarded-for", () => {
    const req = new Request("http://localhost/api/newsletter", {
      headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.1" },
    });
    expect(getClientIp(req)).toBe("203.0.113.9");
  });

  it("mengembalikan unknown tanpa header", () => {
    const req = new Request("http://localhost/api/newsletter");
    expect(getClientIp(req)).toBe("unknown");
  });
});
