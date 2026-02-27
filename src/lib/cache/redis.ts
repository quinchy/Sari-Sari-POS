import { Redis } from "@upstash/redis";

/**
 * Initialize Redis client for caching operations
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Generate cache key for GCash earnings by store
 */
export const getGCashEarningsCacheKey = (storeId: string): string => {
  return `gcash-earnings:${storeId}`;
};

/**
 * Invalidate GCash earnings cache for a specific store
 */
export const invalidateGCashEarningsCache = async (
  storeId: string,
): Promise<void> => {
  const cacheKey = getGCashEarningsCacheKey(storeId);
  await redis.del(cacheKey);
};

/**
 * Get cached GCash earnings for a store
 */
export const getCachedGCashEarnings = async <T>(storeId: string): Promise<T | null> => {
  const cacheKey = getGCashEarningsCacheKey(storeId);
  return redis.get<T>(cacheKey);
};

/**
 * Set cached GCash earnings for a store with TTL
 */
export const setCachedGCashEarnings = async <T>(
  storeId: string,
  data: T,
  ttlSeconds: number = 300, // 5 minutes default
): Promise<void> => {
  const cacheKey = getGCashEarningsCacheKey(storeId);
  await redis.set(cacheKey, data, { ex: ttlSeconds });
};
