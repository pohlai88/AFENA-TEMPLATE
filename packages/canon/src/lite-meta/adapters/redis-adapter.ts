/**
 * Redis Cache Adapter for LiteMeta
 * 
 * Optional adapter that implements CacheStore interface for Redis/Valkey.
 * Tree-shakeable - only included if imported.
 * 
 * @example
 * ```typescript
 * import { Redis } from 'ioredis';
 * import { createRedisAdapter } from 'afena-canon/lite-meta/adapters/redis-adapter';
 * 
 * const redis = new Redis();
 * const redisCache = createRedisAdapter(redis, { prefix: 'litemeta:' });
 * 
 * // Use with TieredCache for L1+L2
 * const tiered = new TieredCache(assetKeyCache, redisCache);
 * ```
 */

import type { CacheSetOptions, CacheStore } from '../cache/cache-store';

/**
 * Redis client interface (minimal subset)
 * Compatible with ioredis, node-redis, and other Redis clients
 */
export interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<string | null>;
  setex(key: string, seconds: number, value: string): Promise<string | null>;
  del(key: string): Promise<number>;
  flushdb(): Promise<string>;
  exists(key: string): Promise<number>;
}

/**
 * Redis adapter options
 */
export interface RedisAdapterOptions {
  /**
   * Key prefix for namespacing (default: 'litemeta:')
   */
  prefix?: string;

  /**
   * Default TTL in seconds (default: undefined - no expiration)
   */
  defaultTtlSeconds?: number;

  /**
   * Serializer for values (default: JSON.stringify)
   */
  serialize?: (value: unknown) => string;

  /**
   * Deserializer for values (default: JSON.parse)
   */
  deserialize?: (value: string) => unknown;

  /**
   * Whether to emit errors (default: false - swallow errors)
   */
  throwOnError?: boolean;
}

/**
 * Create Redis cache adapter
 * 
 * Implements CacheStore interface for use with TieredCache or standalone.
 * 
 * @param client - Redis client instance
 * @param options - Adapter options
 * @returns CacheStore implementation backed by Redis
 */
export function createRedisAdapter<K, V>(
  client: RedisClient,
  options: RedisAdapterOptions = {}
): CacheStore<K, V> {
  const {
    prefix = 'litemeta:',
    defaultTtlSeconds,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    throwOnError = false,
  } = options;

  /**
   * Build Redis key with prefix
   */
  function buildKey(key: K): string {
    return `${prefix}${String(key)}`;
  }

  /**
   * Handle errors based on throwOnError option
   */
  function handleError(error: unknown): void {
    if (throwOnError) {
      throw error;
    }
    // Swallow errors by default (fail-open for cache)
  }

  return {
    async get(key: K): Promise<V | undefined> {
      try {
        const redisKey = buildKey(key);
        const value = await client.get(redisKey);

        if (value === null) {
          return undefined;
        }

        return deserialize(value) as V;
      } catch (error) {
        handleError(error);
        return undefined;
      }
    },

    async set(key: K, value: V, opts?: CacheSetOptions): Promise<void> {
      try {
        const redisKey = buildKey(key);
        const serialized = serialize(value);

        // Determine TTL (options.ttl takes precedence over default)
        const ttlMs = opts?.ttl ?? (defaultTtlSeconds ? defaultTtlSeconds * 1000 : undefined);

        if (ttlMs) {
          const ttlSeconds = Math.ceil(ttlMs / 1000);
          await client.setex(redisKey, ttlSeconds, serialized);
        } else {
          await client.set(redisKey, serialized);
        }
      } catch (error) {
        handleError(error);
      }
    },

    async delete(key: K): Promise<boolean> {
      try {
        const redisKey = buildKey(key);
        const result = await client.del(redisKey);
        return result > 0;
      } catch (error) {
        handleError(error);
        return false;
      }
    },

    async clear(): Promise<void> {
      try {
        // WARNING: This clears the entire Redis database
        // In production, consider using SCAN + DEL with prefix matching
        await client.flushdb();
      } catch (error) {
        handleError(error);
      }
    },

    async has(key: K): Promise<boolean> {
      try {
        const redisKey = buildKey(key);
        const result = await client.exists(redisKey);
        return result > 0;
      } catch (error) {
        handleError(error);
        return false;
      }
    },
  };
}

/**
 * Create Redis adapter with safe clear (prefix-based)
 * 
 * Unlike the default adapter, this version only clears keys with the specified prefix.
 * Safer for shared Redis instances.
 * 
 * @param client - Redis client with SCAN support
 * @param options - Adapter options
 * @returns CacheStore with safe clear operation
 */
export function createSafeRedisAdapter<K, V>(
  client: RedisClient & { scan: (cursor: string, match: string, count: number) => Promise<[string, string[]]> },
  options: RedisAdapterOptions = {}
): CacheStore<K, V> {
  const baseAdapter = createRedisAdapter<K, V>(client, options);
  const prefix = options.prefix ?? 'litemeta:';

  return {
    ...baseAdapter,

    async clear(): Promise<void> {
      try {
        // Use SCAN to find all keys with prefix
        let cursor = '0';
        const pattern = `${prefix}*`;

        do {
          const [nextCursor, keys] = await client.scan(cursor, pattern, 100);
          cursor = nextCursor;

          if (keys.length > 0) {
            // Delete keys in batch
            await Promise.all(keys.map((key) => client.del(key)));
          }
        } while (cursor !== '0');
      } catch (error) {
        if (options.throwOnError) {
          throw error;
        }
      }
    },
  };
}

/**
 * Create Redis adapter with compression
 * 
 * Uses gzip compression for values to reduce Redis memory usage.
 * Requires zlib or compatible compression library.
 * 
 * Note: Compression is synchronous in this implementation.
 * For async compression, implement a custom CacheStore.
 * 
 * @param client - Redis client instance
 * @param compress - Synchronous compression function
 * @param decompress - Synchronous decompression function
 * @param options - Adapter options
 * @returns CacheStore with compression
 */
export function createCompressedRedisAdapter<K, V>(
  client: RedisClient,
  compress: (data: string) => Buffer,
  decompress: (data: Buffer) => string,
  options: Omit<RedisAdapterOptions, 'serialize' | 'deserialize'> = {}
): CacheStore<K, V> {
  return createRedisAdapter<K, V>(client, {
    ...options,
    serialize: (value: unknown) => {
      const json = JSON.stringify(value);
      const compressed = compress(json);
      return compressed.toString('base64');
    },
    deserialize: (value: string) => {
      const buffer = Buffer.from(value, 'base64');
      const decompressed = decompress(buffer);
      return JSON.parse(decompressed);
    },
  });
}
