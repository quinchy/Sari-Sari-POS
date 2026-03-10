import { redis } from "@/lib/redis/client";
import { GetProductsParams } from "../types/products";

/*
  Products Caching
*/

export const buildProductsCacheKey = (
  storeId: string,
  opts: GetProductsParams = {},
): string => {
  const { page, limit, search, category } = opts;
  const baseKey = `products:${storeId}`;

  const hasSearch = search != null && search.length > 0;
  if (hasSearch) {
    return `${baseKey}:search=${search}`;
  }

  const hasCategory = category != null && category.length > 0;
  if (hasCategory) {
    return `${baseKey}:category=${category}`;
  }

  const hasPagination = page != null || limit != null;
  if (!hasPagination) return baseKey;

  const normalizedPage = page ?? 1;
  const normalizedLimit = limit ?? 15;

  return `${baseKey}:page=${normalizedPage}:limit=${normalizedLimit}`;
};

export const getCachedProducts = async <T>(
  cacheKey: string,
): Promise<T | null> => {
  const cached = await redis.get(cacheKey);

  if (!cached) return null;

  return cached as T;
};

export const setCachedProducts = async <T>(
  payload: T,
  storeId: string,
  opts: GetProductsParams = {},
  ttlSeconds: number = 300,
): Promise<void> => {
  const { page, limit, search, category } = opts;
  const cacheKey = buildProductsCacheKey(storeId, {
    page,
    limit,
    search,
    category,
  });

  try {
    await redis.set(cacheKey, payload, { ex: ttlSeconds });
  } catch {
    // Cache failures should not break the request.
  }
};

export const invalidateProductsCache = async (
  storeId: string,
  opts: GetProductsParams = {},
): Promise<void> => {
  const { page, limit, search, category } = opts;

  const hasSpecificFilters =
    page != null || limit != null || search != null || category != null;

  if (hasSpecificFilters) {
    const cacheKey = buildProductsCacheKey(storeId, {
      page,
      limit,
      search,
      category,
    });
    await redis.del(cacheKey);
    return;
  }

  const baseKey = buildProductsCacheKey(storeId);
  await redis.del(baseKey);

  const pagesToClear = 10;
  const defaultLimit = 15;

  // Clear paginated keys
  const pageKeys = Array.from({ length: pagesToClear }, (_, i) =>
    buildProductsCacheKey(storeId, { page: i + 1, limit: defaultLimit }),
  );

  // Clear search keys (generic search)
  const searchKeys = [
    buildProductsCacheKey(storeId, { search: "" }),
  ];

  // Clear category keys
  const categoryKeys = [
    buildProductsCacheKey(storeId, { category: "" }),
  ];

  await Promise.all(
    [...pageKeys, ...searchKeys, ...categoryKeys].map((k) => redis.del(k)),
  );
};

/*
  Products Analytics - Total, Low Stock Caching
*/

export const getProductsTotalCacheKey = (storeId: string): string => {
  return `products-total:${storeId}`;
};

export const getProductsLowStockCacheKey = (storeId: string): string => {
  return `products-low-stock:${storeId}`;
};

// Get cached total products
export const getCachedProductsTotal = async (
  storeId: string,
): Promise<number | null> => {
  const cacheKey = getProductsTotalCacheKey(storeId);
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

// Set cached total products
export const setCachedProductsTotal = async (
  storeId: string,
  total: number,
  ttlSeconds: number = 300,
): Promise<void> => {
  const cacheKey = getProductsTotalCacheKey(storeId);
  try {
    await redis.set(cacheKey, JSON.stringify(total), { ex: ttlSeconds });
  } catch {
    // Ignore cache errors
  }
};

// Get cached low stock products
export const getCachedProductsLowStock = async (
  storeId: string,
): Promise<number | null> => {
  const cacheKey = getProductsLowStockCacheKey(storeId);
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

// Set cached low stock products
export const setCachedProductsLowStock = async (
  storeId: string,
  count: number,
  ttlSeconds: number = 300,
): Promise<void> => {
  const cacheKey = getProductsLowStockCacheKey(storeId);
  try {
    await redis.set(cacheKey, JSON.stringify(count), { ex: ttlSeconds });
  } catch {
    // Ignore cache errors
  }
};

export const invalidateAllProductsCache = async (
  storeId: string,
): Promise<void> => {
  // Delete base and paginated keys
  await invalidateProductsCache(storeId);

  // Delete total and low stock keys
  await redis.del(getProductsTotalCacheKey(storeId));
  await redis.del(getProductsLowStockCacheKey(storeId));
};
