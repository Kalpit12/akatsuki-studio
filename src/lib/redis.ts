import { Redis } from "@upstash/redis";

let redis: Redis | null | undefined;

/** Upstash Redis client, or null when env vars are missing. */
export function getRedis(): Redis | null {
  if (redis !== undefined) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    redis = null;
    return redis;
  }

  redis = new Redis({ url, token });
  return redis;
}

export const PRESENCE_ZSET = "presence:z";
export const VISITS_TOTAL_KEY = "visits:total";
export const PRESENCE_TTL_MS = 45_000;
