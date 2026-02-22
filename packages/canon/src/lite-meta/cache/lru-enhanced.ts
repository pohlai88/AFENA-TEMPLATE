/**
 * Enhanced LRU Cache with Stats, TTL, and Size Tracking
 * 
 * Pure in-memory caching only - no distributed cache dependencies.
 * Provides observability through cache stats without forcing logging.
 * 
 * Emits instrumentation events when hooks are enabled (zero overhead when disabled).
 */

import {
  emitCacheClear,
  emitCacheEvict,
  emitCacheHit,
  emitCacheMiss,
  emitCacheSet,
} from '../hooks/instrumentation';

export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  maxSize: number;
  hitRate: number;
  approximateMemoryBytes: number;
}

export interface CacheEntry<V> {
  value: V;
  expiresAt?: number;
  approximateSize: number;
}

export interface CacheOptions {
  maxSize?: number;
  ttlMs?: number;
  estimateSize?: (value: unknown) => number;
  cacheName?: string;
}

/**
 * Enhanced Bounded LRU Cache
 * 
 * Features:
 * - LRU eviction policy
 * - Optional TTL (time-to-live)
 * - Size tracking (approximate)
 * - Hit/miss/eviction stats
 * - Zero side effects (pure in-memory)
 */
export class EnhancedLRU<K, V> {
  private cache = new Map<K, CacheEntry<V>>();
  private readonly maxSize: number;
  private readonly ttlMs?: number;
  private readonly estimateSize: (value: unknown) => number;
  private readonly cacheName: string;

  // Stats
  private hits = 0;
  private misses = 0;
  private evictions = 0;
  private totalMemoryBytes = 0;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize ?? 1000;
    this.cacheName = options.cacheName ?? 'EnhancedLRU';
    // Only assign ttlMs if explicitly provided
    if (options.ttlMs !== undefined) {
      this.ttlMs = options.ttlMs;
    }
    this.estimateSize = options.estimateSize ?? this.defaultSizeEstimator;
  }

  /**
   * Get value from cache
   * Handles TTL expiration and updates stats
   */
  get(key: K): V | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      emitCacheMiss(String(key), this.cacheName);
      return undefined;
    }

    // Check TTL expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.totalMemoryBytes -= entry.approximateSize;
      this.misses++;
      emitCacheMiss(String(key), this.cacheName, { reason: 'expired' });
      return undefined;
    }

    // Move to end (LRU - most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);

    this.hits++;
    emitCacheHit(String(key), this.cacheName);
    return entry.value;
  }

  /**
   * Set value in cache
   * Evicts oldest entry if at capacity
   */
  set(key: K, value: V): void {
    const approximateSize = this.estimateSize(value);

    // Remove existing entry if present
    const existing = this.cache.get(key);
    if (existing) {
      this.totalMemoryBytes -= existing.approximateSize;
      this.cache.delete(key);
    }

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        const evicted = this.cache.get(firstKey);
        if (evicted) {
          this.totalMemoryBytes -= evicted.approximateSize;
        }
        this.cache.delete(firstKey);
        this.evictions++;
        emitCacheEvict(String(firstKey), this.cacheName);
      }
    }

    // Build entry with conditional spread for optional expiresAt
    const entry: CacheEntry<V> = {
      value,
      approximateSize,
      ...(this.ttlMs ? { expiresAt: Date.now() + this.ttlMs } : {}),
    };

    this.cache.set(key, entry);
    this.totalMemoryBytes += approximateSize;
    emitCacheSet(String(key), this.cacheName, { size: approximateSize });
  }

  /**
   * Delete specific key from cache
   */
  delete(key: K): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.totalMemoryBytes -= entry.approximateSize;
      return this.cache.delete(key);
    }
    return false;
  }

  /**
   * Clear all entries from cache
   */
  clear(): void {
    this.cache.clear();
    this.totalMemoryBytes = 0;
    emitCacheClear(this.cacheName);
    // Don't reset stats - they're cumulative
  }

  /**
   * Check if key exists in cache (doesn't update LRU order)
   */
  has(key: K): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check TTL expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.totalMemoryBytes -= entry.approximateSize;
      return false;
    }

    return true;
  }

  /**
   * Get current cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? this.hits / total : 0;

    return {
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate,
      approximateMemoryBytes: this.totalMemoryBytes,
    };
  }

  /**
   * Reset statistics (but keep cache contents)
   */
  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
  }

  /**
   * Default size estimator (rough approximation)
   */
  private defaultSizeEstimator(value: unknown): number {
    if (value === null || value === undefined) return 8;

    const type = typeof value;

    if (type === 'boolean') return 4;
    if (type === 'number') return 8;
    if (type === 'string') return (value as string).length * 2; // UTF-16
    if (type === 'object') {
      // Rough estimate for objects
      return JSON.stringify(value).length * 2;
    }

    return 64; // Default for unknown types
  }
}

/**
 * Singleton caches for hot paths
 * These are created once and reused across the application
 */

/**
 * Cache for parseAssetKey results (most frequently called)
 */
export const assetKeyCache = new EnhancedLRU<string, unknown>({
  maxSize: 1000,
  cacheName: 'assetKeyCache',
  // No TTL - pure functions never change
});

/**
 * Cache for deriveAssetTypeFromKey results
 */
export const typeDerivationCache = new EnhancedLRU<string, unknown>({
  maxSize: 500,
  cacheName: 'typeDerivationCache',
  // No TTL - pure functions never change
});

/**
 * Get combined cache statistics
 */
export function getAllCacheStats(): Record<string, CacheStats> {
  return {
    assetKeyCache: assetKeyCache.getStats(),
    typeDerivationCache: typeDerivationCache.getStats(),
  };
}
