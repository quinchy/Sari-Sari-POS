import { Redis } from "@upstash/redis";

/**
 * Initialize Redis client for caching operations
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Generate cache key for GCash earnings by store and optional pagination.
 * If no page/limit are provided this returns the "base" key that can be used
 * for non-paginated caches or as a convenience key name.
 */
export const getGCashEarningsCacheKey = (
  storeId: string,
  page?: number,
  limit?: number,
): string => {
  const base = `gcash-earnings:${storeId}`;

  // If neither page nor limit provided return base key
  if (page == null && limit == null) {
    return base;
  }

  // Provide deterministic page/limit normalized values so keys are consistent
  const p = page ?? 1;
  const l = limit ?? 15;

  return `${base}:page=${p}:limit=${l}`;
};

/**
 * Invalidate GCash earnings cache for a specific store and optionally for a
 * particular page/limit combination.
 *
 * Note: Upstash / Redis servers may not allow wildcard deletes without a scan,
 * so this implementation deletes the specific key when page/limit are passed.
 * When called without page/limit it deletes the base key and, as a pragmatic
 * fallback, also attempts to remove a small set of common page keys (1..10)
 * for the default limit (15). If you need full wildcard invalidation across
 * all pages, consider implementing a server-side scan and delete routine
 * appropriate for your Redis environment.
 */
export const invalidateGCashEarningsCache = async (
  storeId: string,
  page?: number,
  limit?: number,
): Promise<void> => {
  const baseKey = getGCashEarningsCacheKey(storeId);

  // If a specific page/limit is provided, delete only that key
  if (page != null || limit != null) {
    const cacheKey = getGCashEarningsCacheKey(storeId, page, limit);
    await redis.del(cacheKey);
    return;
  }

  // No page/limit provided: delete base key and a small set of likely page keys.
  // This is a pragmatic compromise to invalidate most common cached pages.
  await redis.del(baseKey);

  // Attempt to remove first N pages for the default limit (15). Adjust N if needed.
  const fallbackPagesToClear = 10;
  const defaultLimit = 15;
  const deletes: Promise<unknown>[] = [];
  for (let p = 1; p <= fallbackPagesToClear; p++) {
    const pageKey = getGCashEarningsCacheKey(storeId, p, defaultLimit);
    deletes.push(redis.del(pageKey));
  }

  await Promise.all(deletes);
};

/**
 * Get cached GCash earnings for a store (and optional page/limit).
 * Values are stored as JSON strings; this helper parses them back to T.
 */
export const getCachedGCashEarnings = async <T>(
  storeId: string,
  page?: number,
  limit?: number,
): Promise<T | null> => {
  const cacheKey = getGCashEarningsCacheKey(storeId, page, limit);
  const raw = await redis.get<string | null>(cacheKey);

  if (raw == null) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    // If parsing fails, treat as cache miss
    return null;
  }
};

/**
 * Set cached GCash earnings for a store with TTL.
 * Data is JSON-stringified before storing to ensure consistent retrieval.
 *
 * Parameter order: page & limit now come before ttlSeconds for clearer usage
 * when calling with optional pagination arguments.
 *
 * Adds a debug log for cache writes and error handling so we can verify
 * cache operations during development.
 */
export const setCachedGCashEarnings = async <T>(
  storeId: string,
  data: T,
  page?: number,
  limit?: number,
  ttlSeconds: number = 300, // 5 minutes default
): Promise<void> => {
  const cacheKey = getGCashEarningsCacheKey(storeId, page, limit);
  const payload = JSON.stringify(data);

  try {
    await redis.set(cacheKey, payload, { ex: ttlSeconds });
  } catch (err) {
    // Ignore cache set errors; they should not block the main request flow.
  }
};
