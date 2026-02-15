/**
 * Optional Upstash Redis cache for listEntities (Phase 2C).
 *
 * When UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set,
 * list results are cached. orgId is required for cache keys (tenant-safe).
 * Never cache across orgs.
 *
 * TTL: 60s default (30–120s range per plan).
 */

import { Redis } from '@upstash/redis';

const CACHE_TTL_SEC = Number(process.env.LIST_CACHE_TTL_SEC) || 60;
const CACHE_PREFIX = 'afena:list:';

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

export type ListCacheOptions = {
  entityType: string;
  orgId: string;
  includeDeleted?: boolean;
  includeCount?: boolean;
  limit?: number;
  offset?: number;
  cursor?: string;
};

/** Deterministic cache key (tenant-safe, never cross-org). Version enables invalidation. */
export function buildListCacheKey(opts: ListCacheOptions, version: number): string {
  const parts = [
    opts.entityType,
    opts.orgId,
    String(version),
    opts.includeDeleted ? '1' : '0',
    opts.includeCount ? '1' : '0',
    String(opts.limit ?? 100),
    String(opts.offset ?? 0),
    opts.cursor ?? '',
  ];
  return CACHE_PREFIX + Buffer.from(parts.join(':'), 'utf8').toString('base64url');
}

export type CachedListResult = {
  data: unknown[];
  meta?: { totalCount?: number; nextCursor?: string };
};

/** Get cached list result if available. Returns null on miss or when cache disabled. */
export async function getCachedList(
  key: string,
): Promise<CachedListResult | null> {
  const r = getRedis();
  if (!r) return null;
  try {
    const raw = await r.get<string>(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedListResult;
    // Rehydrate Date objects if needed (ISO strings in JSON)
    if (Array.isArray(parsed.data)) {
      parsed.data = (parsed.data as Record<string, unknown>[]).map((row) => {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(row)) {
          if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
            out[k] = new Date(v);
          } else {
            out[k] = v;
          }
        }
        return out;
      });
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Store list result in cache. No-op when cache disabled. */
export async function setCachedList(
  key: string,
  result: CachedListResult,
): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.setex(key, CACHE_TTL_SEC, JSON.stringify(result));
  } catch {
    // Best-effort; don't fail the request
  }
}

/**
 * Invalidate cache for an entity type + org (e.g. after mutate).
 * Uses a version key: incrementing it makes all cached keys for that entity:org stale.
 * Call after insert/update/delete when entityType and orgId are known.
 */
const VERSION_PREFIX = 'afena:list:v:';

export async function invalidateListCache(entityType: string, orgId: string): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    const versionKey = `${VERSION_PREFIX}${entityType}:${orgId}`;
    await r.incr(versionKey);
    await r.expire(versionKey, 86400); // Keep version key 24h
  } catch {
    // Best-effort
  }
}

/** Get current cache version for entity:org (for cache key). */
export async function getListCacheVersion(entityType: string, orgId: string): Promise<number> {
  const r = getRedis();
  if (!r) return 0;
  try {
    const v = await r.get<number>(`${VERSION_PREFIX}${entityType}:${orgId}`);
    return typeof v === 'number' ? v : 0;
  } catch {
    return 0;
  }
}

/** Whether cache is enabled (env vars set). */
export function isListCacheEnabled(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}
