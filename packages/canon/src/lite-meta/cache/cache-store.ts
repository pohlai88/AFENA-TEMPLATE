/**
 * CacheStore Interface
 * 
 * Abstract interface for L2 cache implementations (Redis, Valkey, etc.)
 * Enables distributed caching without coupling core to specific implementations.
 */

import type { CacheStats } from './lru-enhanced';

/**
 * Cache store interface for L2 cache implementations
 * 
 * Implementations can be synchronous or asynchronous.
 * The enhanced LRU cache can use this as a fallback/write-through layer.
 * 
 * @example
 * ```typescript
 * // Redis implementation
 * class RedisCacheStore implements CacheStore<string, string> {
 *   constructor(private redis: Redis) {}
 *   
 *   async get(key: string): Promise<string | undefined> {
 *     const value = await this.redis.get(key);
 *     return value ?? undefined;
 *   }
 *   
 *   async set(key: string, value: string, opts?: { ttl?: number }): Promise<void> {
 *     if (opts?.ttl) {
 *       await this.redis.setex(key, opts.ttl / 1000, value);
 *     } else {
 *       await this.redis.set(key, value);
 *     }
 *   }
 * }
 * ```
 */
export interface CacheStore<K, V> {
  /**
   * Get a value from the cache
   * 
   * @param key - Cache key
   * @returns Value if found, undefined otherwise
   */
  get(key: K): V | undefined | Promise<V | undefined>;

  /**
   * Set a value in the cache
   * 
   * @param key - Cache key
   * @param value - Value to cache
   * @param options - Optional settings (TTL, etc.)
   */
  set(key: K, value: V, options?: CacheSetOptions): void | Promise<void>;

  /**
   * Delete a value from the cache
   * 
   * @param key - Cache key
   * @returns True if deleted, false if not found
   */
  delete?(key: K): boolean | Promise<boolean>;

  /**
   * Clear all values from the cache
   */
  clear?(): void | Promise<void>;

  /**
   * Check if a key exists in the cache
   * 
   * @param key - Cache key
   * @returns True if key exists
   */
  has?(key: K): boolean | Promise<boolean>;

  /**
   * Get cache statistics (optional)
   * 
   * @returns Cache statistics if available
   */
  stats?(): CacheStats | Promise<CacheStats>;
}

/**
 * Options for cache set operations
 */
export interface CacheSetOptions {
  /**
   * Time-to-live in milliseconds
   */
  ttl?: number;

  /**
   * Cache tags for invalidation
   */
  tags?: string[];

  /**
   * Custom metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Tiered cache that uses L1 (memory) and L2 (distributed) caches
 * 
 * Reads: Check L1 first, then L2, populate L1 on L2 hit
 * Writes: Write to both L1 and L2 (write-through)
 * 
 * @example
 * ```typescript
 * const l1 = new EnhancedLRU({ maxSize: 1000 });
 * const l2 = new RedisCacheStore(redis);
 * const tiered = new TieredCache(l1, l2);
 * 
 * await tiered.get('key'); // Checks L1, then L2
 * await tiered.set('key', 'value'); // Writes to both
 * ```
 */
export class TieredCache<K, V> implements CacheStore<K, V> {
  constructor(
    private l1: CacheStore<K, V>,
    private l2: CacheStore<K, V>
  ) { }

  async get(key: K): Promise<V | undefined> {
    // Check L1 first
    const l1Value = await Promise.resolve(this.l1.get(key));
    if (l1Value !== undefined) {
      return l1Value;
    }

    // Check L2
    const l2Value = await Promise.resolve(this.l2.get(key));
    if (l2Value !== undefined) {
      // Populate L1 on L2 hit
      await Promise.resolve(this.l1.set(key, l2Value));
      return l2Value;
    }

    return undefined;
  }

  async set(key: K, value: V, options?: CacheSetOptions): Promise<void> {
    // Write to both L1 and L2 (write-through)
    await Promise.all([
      Promise.resolve(this.l1.set(key, value, options)),
      Promise.resolve(this.l2.set(key, value, options)),
    ]);
  }

  async delete(key: K): Promise<boolean> {
    // Delete from both caches
    const results = await Promise.all([
      this.l1.delete ? Promise.resolve(this.l1.delete(key)) : Promise.resolve(false),
      this.l2.delete ? Promise.resolve(this.l2.delete(key)) : Promise.resolve(false),
    ]);

    return results.some((r) => r);
  }

  async clear(): Promise<void> {
    // Clear both caches
    await Promise.all([
      this.l1.clear ? Promise.resolve(this.l1.clear()) : Promise.resolve(),
      this.l2.clear ? Promise.resolve(this.l2.clear()) : Promise.resolve(),
    ]);
  }

  async has(key: K): Promise<boolean> {
    // Check L1 first, then L2
    if (this.l1.has) {
      const l1Has = await Promise.resolve(this.l1.has(key));
      if (l1Has) return true;
    }

    if (this.l2.has) {
      return Promise.resolve(this.l2.has(key));
    }

    // Fallback: try to get
    const value = await this.get(key);
    return value !== undefined;
  }

  stats?(): CacheStats | Promise<CacheStats> {
    // Return L1 stats if available
    if (this.l1.stats) {
      return this.l1.stats();
    }
    // Return empty stats if L1 doesn't provide them
    return {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
      maxSize: 0,
      hitRate: 0,
      approximateMemoryBytes: 0,
    };
  }
}

/**
 * No-op cache store for testing or disabling cache
 */
export class NoOpCacheStore<K, V> implements CacheStore<K, V> {
  get(_key: K): undefined {
    return undefined;
  }

  set(_key: K, _value: V, _options?: CacheSetOptions): void {
    // No-op
  }

  delete(_key: K): boolean {
    return false;
  }

  clear(): void {
    // No-op
  }

  has(_key: K): boolean {
    return false;
  }
}
