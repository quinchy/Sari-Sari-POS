import { redis } from "@/lib/redis/client";
import { GetGCashEarningParams } from "../types/gcash";

/*
  GCash Earning Caching
*/

export const buildGCashEarningsCacheKey = (
  storeId: string,
  opts: GetGCashEarningParams = {},
): string => {
  const { page, limit, year, month } = opts;
  const baseKey = `gcash-earnings:${storeId}`;

  const hasChart = year != null || month != null;
  if (hasChart) {
    const y = year ?? 0;
    const m = month ?? 0;
    return `${baseKey}:year=${y}:month=${m}`;
  }

  const hasPagination = page != null || limit != null;
  if (!hasPagination) return baseKey;

  const normalizedPage = page ?? 1;
  const normalizedLimit = limit ?? 15;

  return `${baseKey}:page=${normalizedPage}:limit=${normalizedLimit}`;
};

export const getCachedGCashEarnings = async <T>(
  cacheKey: string,
): Promise<T | null> => {
  const cached = await redis.get(cacheKey);

  if (!cached) return null;

  return cached as T;
};

export const setCachedGCashEarnings = async <T>(
  payload: T,
  storeId: string,
  opts: GetGCashEarningParams = {},
  ttlSeconds: number = 300,
): Promise<void> => {
  const { page, limit, year, month } = opts;
  const cacheKey = buildGCashEarningsCacheKey(storeId, {
    page,
    limit,
    month,
    year,
  });

  try {
    await redis.set(cacheKey, payload, { ex: ttlSeconds });
  } catch {
    // Cache failures should not break the request.
  }
};

export const invalidateGCashEarningsCache = async (
  storeId: string,
  opts: GetGCashEarningParams = {},
): Promise<void> => {
  const { page, limit, year, month } = opts;

  const hasSpecificFilters =
    page != null || limit != null || year != null || month != null;

  if (hasSpecificFilters) {
    const cacheKey = buildGCashEarningsCacheKey(storeId, {
      page,
      limit,
      year,
      month,
    });
    await redis.del(cacheKey);
    return;
  }

  const baseKey = buildGCashEarningsCacheKey(storeId);
  await redis.del(baseKey);

  const pagesToClear = 10;
  const defaultLimit = 15;

  // Clear paginated keys
  const pageKeys = Array.from({ length: pagesToClear }, (_, i) =>
    buildGCashEarningsCacheKey(storeId, { page: i + 1, limit: defaultLimit }),
  );

  // Clear chart keys (year/month filtered)
  const currentYear = new Date().getFullYear();
  const chartKeys = Array.from({ length: 12 }, (_, i) =>
    buildGCashEarningsCacheKey(storeId, { year: currentYear, month: i + 1 }),
  );

  await Promise.all([...pageKeys, ...chartKeys].map((k) => redis.del(k)));
};

/*
  GCash Earning Analytics - Total, Lowest, Highest Caching
*/

export const getGCashEarningsTotalCacheKey = (storeId: string): string => {
  return `gcash-earnings-total:${storeId}`;
};

export const getGCashEarningsExtremeCacheKey = (
  storeId: string,
  type: "highest" | "lowest",
): string => {
  return `gcash-earnings-extreme:${storeId}:${type}`;
};

// Get cached total earnings
export const getCachedGCashEarningsTotal = async (
  storeId: string,
): Promise<number | null> => {
  const cacheKey = getGCashEarningsTotalCacheKey(storeId);
  const raw = await redis.get<string | null>(cacheKey);

  if (raw == null) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "number" ? parsed : null;
  } catch {
    return null;
  }
};

// Set cached total earnings
export const setCachedGCashEarningsTotal = async (
  storeId: string,
  total: number,
  ttlSeconds: number = 300,
): Promise<void> => {
  const cacheKey = getGCashEarningsTotalCacheKey(storeId);
  try {
    await redis.set(cacheKey, JSON.stringify(total), { ex: ttlSeconds });
  } catch {
    // Ignore cache errors
  }
};

// Get cached extreme earnings
export const getCachedGCashEarningsExtreme = async (
  storeId: string,
  type: "highest" | "lowest",
): Promise<{ id: string; amount: number; created_at: Date } | null> => {
  const cacheKey = getGCashEarningsExtremeCacheKey(storeId, type);
  const raw = await redis.get<string | null>(cacheKey);

  if (raw == null) {
    return null;
  }

  try {
    return JSON.parse(raw) as { id: string; amount: number; created_at: Date };
  } catch {
    return null;
  }
};

export const setCachedGCashEarningsExtreme = async (
  storeId: string,
  type: "highest" | "lowest",
  data: { id: string; amount: number; created_at: Date },
  ttlSeconds: number = 300,
): Promise<void> => {
  const cacheKey = getGCashEarningsExtremeCacheKey(storeId, type);
  try {
    await redis.set(cacheKey, JSON.stringify(data), { ex: ttlSeconds });
  } catch {
    // Ignore cache errors
  }
};

export const invalidateAllGCashEarningsCache = async (
  storeId: string,
): Promise<void> => {
  // Delete base and paginated keys
  await invalidateGCashEarningsCache(storeId);

  // Delete total and extreme keys
  await redis.del(getGCashEarningsTotalCacheKey(storeId));
  await redis.del(getGCashEarningsExtremeCacheKey(storeId, "highest"));
  await redis.del(getGCashEarningsExtremeCacheKey(storeId, "lowest"));
};
