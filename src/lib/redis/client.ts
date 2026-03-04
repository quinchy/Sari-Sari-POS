import { Redis } from "@upstash/redis";

/**
 * Initialize Redis client for caching operations
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
