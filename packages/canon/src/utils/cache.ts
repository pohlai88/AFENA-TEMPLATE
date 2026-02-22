/**
 * Single LRU cache for pure deterministic functions
 * 
 * No TTL - these functions are pure and results never expire.
 * Bounded size prevents memory bloat.
 * 
 * Phase 2: Performance optimization
 */

interface CacheEntry<V> {
  value: V;
}

/**
 * Bounded Least Recently Used (LRU) cache
 * 
 * @template K - Key type
 * @template V - Value type
 */
export class BoundedLRU<K, V> {
  private cache = new Map<K, CacheEntry<V>>();
  private readonly maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  /**
   * Get value from cache
   * 
   * @param key - Cache key
   * @returns Cached value or undefined if not found
   */
  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    // Move to end (LRU - most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  /**
   * Set value in cache
   * 
   * @param key - Cache key
   * @param value - Value to cache
   */
  set(key: K, value: V): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, { value });
  }

  /**
   * Clear all entries from cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get current cache size
   * 
   * @returns Number of entries in cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Check if key exists in cache
   * 
   * @param key - Cache key
   * @returns True if key exists
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }
}

/**
 * Singleton caches for hot paths
 * 
 * These are created once and reused across the application.
 * Max sizes are tuned based on expected usage patterns.
 */

/**
 * Cache for parseAssetKey results (most frequently called)
 */
export const assetKeyCache = new BoundedLRU<string, unknown>(1000);

/**
 * Cache for deriveAssetTypeFromKey results
 */
export const typeDerivationCache = new BoundedLRU<string, unknown>(500);

/**
 * Cache for mapPostgresType results
 */
export const postgresTypeCache = new BoundedLRU<string, unknown>(500);
