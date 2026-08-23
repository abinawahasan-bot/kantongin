import type { Ratelimit } from "@upstash/ratelimit";

type RateLimitResult = { ok: boolean; retryAfter?: number };

const buckets = new Map<string, { count: number; resetAt: number }>();

function inMemoryLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return {
      ok: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  return { ok: true };
}

const limiters = new Map<string, Promise<Ratelimit | null>>();

function getUpstashLimiter(limit: number, windowMs: number): Promise<Ratelimit | null> {
  const cacheKey = `${limit}:${windowMs}`;
  let cached = limiters.get(cacheKey);
  if (!cached) {
    cached = (async () => {
      const url = process.env.UPSTASH_REDIS_REST_URL;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN;
      if (!url || !token) return null;
      const [{ Redis }, { Ratelimit: RatelimitClass }] = await Promise.all([
        import("@upstash/redis"),
        import("@upstash/ratelimit"),
      ]);
      return new RatelimitClass({
        redis: new Redis({ url, token }),
        limiter: RatelimitClass.fixedWindow(limit, `${windowMs} ms`),
        prefix: "kantongin:ratelimit",
      }) as Ratelimit;
    })();
    limiters.set(cacheKey, cached);
  }
  return cached;
}

export async function rateLimitByIp(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const upstash = await getUpstashLimiter(limit, windowMs);
  if (upstash) {
    try {
      const { success, reset } = await upstash.limit(key);
      if (success) return { ok: true };
      return {
        ok: false,
        retryAfter: Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
      };
    } catch (error) {
      console.warn("[rate-limit] Upstash gagal, fallback ke in-memory:", error);
    }
  }
  return inMemoryLimit(key, limit, windowMs);
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
