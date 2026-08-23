import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getClientIp, rateLimitByIp } from "./rate-limit";

const { limitMock, fixedWindowMock, redisState } = vi.hoisted(() => ({
  limitMock: vi.fn(),
  fixedWindowMock: vi.fn(),
  redisState: { gagalKonstruksi: false },
}));

vi.mock("@upstash/redis", () => ({
  Redis: class {
    constructor(_opts: unknown) {
      if (redisState.gagalKonstruksi) {
        throw new Error("cold start Upstash gagal");
      }
    }
  },
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: Object.assign(
    class {
      limit = limitMock;
      constructor(_opts: unknown) {}
    },
    { fixedWindow: fixedWindowMock }
  ),
}));

describe("rateLimitByIp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("mengizinkan permintaan pertama", async () => {
    expect(await rateLimitByIp("a", 3, 1000)).toEqual({ ok: true });
  });

  it("menolak setelah melewati batas", async () => {
    await rateLimitByIp("b", 3, 1000);
    await rateLimitByIp("b", 3, 1000);
    await rateLimitByIp("b", 3, 1000);
    const result = await rateLimitByIp("b", 3, 1000);
    expect(result.ok).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it("mengisi ulang bucket setelah window berlalu", async () => {
    await rateLimitByIp("c", 1, 1000);
    expect((await rateLimitByIp("c", 1, 1000)).ok).toBe(false);
    vi.advanceTimersByTime(1001);
    expect((await rateLimitByIp("c", 1, 1000)).ok).toBe(true);
  });

  it("menghitung key per IP secara terpisah", async () => {
    await rateLimitByIp("d", 1, 1000);
    expect((await rateLimitByIp("d", 1, 1000)).ok).toBe(false);
    expect((await rateLimitByIp("e", 1, 1000)).ok).toBe(true);
  });
});

describe("jalur Upstash", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    limitMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("memakai Redis dan mengizinkan saat success", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://contoh.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token-rahasia");
    limitMock.mockResolvedValue({ success: true, reset: Date.now() + 60_000 });
    await expect(rateLimitByIp("u1", 5, 60_000)).resolves.toEqual({ ok: true });
    expect(limitMock).toHaveBeenCalledWith("u1");
    expect(fixedWindowMock).toHaveBeenCalledWith(5, "60000 ms");
  });

  it("menolak dengan retryAfter saat success=false", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://contoh.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token-rahasia");
    limitMock.mockResolvedValue({ success: false, reset: Date.now() + 30_000 });
    const result = await rateLimitByIp(`u2-${Math.random()}`, 5, 90_000);
    expect(result.ok).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it("fallback ke in-memory saat Redis error", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://contoh.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token-rahasia");
    limitMock.mockRejectedValue(new Error("redis down"));
    const result = await rateLimitByIp(`u3-${Math.random()}`, 5, 120_000);
    expect(result).toEqual({ ok: true });
  });

  it("fallback ke in-memory saat gagal muat Upstash dan mencoba ulang di panggilan berikutnya", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://contoh.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token-rahasia");
    redisState.gagalKonstruksi = true;

    await expect(rateLimitByIp("f1", 7, 210_000)).resolves.toEqual({ ok: true });
    await expect(rateLimitByIp("f1", 7, 210_000)).resolves.toEqual({ ok: true });

    redisState.gagalKonstruksi = false;
    limitMock.mockResolvedValue({ success: true, reset: Date.now() + 60_000 });
    await expect(rateLimitByIp("f1", 7, 210_000)).resolves.toEqual({ ok: true });
    expect(limitMock).toHaveBeenCalledWith("f1");
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
