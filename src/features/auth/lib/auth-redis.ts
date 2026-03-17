import { redis } from "@/lib/redis/client";

/*
  Current User Caching
*/

export const getCurrentUserCacheKey = (userId: string): string => {
  return `current-user:${userId}`;
};

export const getCachedCurrentUser = async <T>(
  userId: string,
): Promise<T | null> => {
  const cacheKey = getCurrentUserCacheKey(userId);
  const cached = await redis.get<T>(cacheKey);

  if (!cached) return null;

  return cached;
};

export const setCachedCurrentUser = async <T>(
  userId: string,
  payload: T,
  ttlSeconds: number = 60,
): Promise<void> => {
  const cacheKey = getCurrentUserCacheKey(userId);

  try {
    await redis.set(cacheKey, payload, { ex: ttlSeconds });
  } catch {
    // Cache failures should not break the request.
  }
};

export const invalidateCurrentUserCache = async (
  userId: string,
): Promise<void> => {
  const cacheKey = getCurrentUserCacheKey(userId);
  await redis.del(cacheKey);
};
