/**
 * Enhanced LRU Cache Tests
 * 
 * Tests for in-memory LRU cache with stats and TTL
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { EnhancedLRU, getAllCacheStats } from '../lru-enhanced';

describe('EnhancedLRU', () => {
  let cache: EnhancedLRU<string, string>;

  beforeEach(() => {
    cache = new EnhancedLRU({ maxSize: 3 });
  });

  describe('Basic Operations', () => {
    it('should set and get values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return undefined for missing keys', () => {
      expect(cache.get('nonexistent')).toBeUndefined();
    });

    it('should check if key exists', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(false);
    });

    it('should delete keys', () => {
      cache.set('key1', 'value1');
      expect(cache.delete('key1')).toBe(true);
      expect(cache.has('key1')).toBe(false);
      expect(cache.delete('key1')).toBe(false);
    });

    it('should clear all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      expect(cache.size()).toBe(0);
      expect(cache.has('key1')).toBe(false);
    });

    it('should report size', () => {
      expect(cache.size()).toBe(0);
      cache.set('key1', 'value1');
      expect(cache.size()).toBe(1);
      cache.set('key2', 'value2');
      expect(cache.size()).toBe(2);
    });
  });

  describe('LRU Eviction', () => {
    it('should evict least recently used item when full', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4'); // Should evict key1

      expect(cache.has('key1')).toBe(false);
      expect(cache.has('key2')).toBe(true);
      expect(cache.has('key3')).toBe(true);
      expect(cache.has('key4')).toBe(true);
    });

    it('should update LRU order on get', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      cache.get('key1'); // Move key1 to front
      cache.set('key4', 'value4'); // Should evict key2

      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(false);
      expect(cache.has('key3')).toBe(true);
      expect(cache.has('key4')).toBe(true);
    });

    it('should update LRU order on set', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      cache.set('key1', 'updated'); // Move key1 to front
      cache.set('key4', 'value4'); // Should evict key2

      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(false);
      expect(cache.get('key1')).toBe('updated');
    });
  });

  describe('TTL Support', () => {
    it('should expire entries after TTL', async () => {
      const cacheWithTTL = new EnhancedLRU<string, string>({
        maxSize: 10,
        ttlMs: 50,
      });

      cacheWithTTL.set('key1', 'value1');
      expect(cacheWithTTL.get('key1')).toBe('value1');

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 60));

      expect(cacheWithTTL.get('key1')).toBeUndefined();
    });

    it('should not expire entries without TTL', async () => {
      cache.set('key1', 'value1');

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(cache.get('key1')).toBe('value1');
    });

    it('should handle mixed expired and valid entries', async () => {
      const cacheWithTTL = new EnhancedLRU<string, string>({
        maxSize: 10,
        ttlMs: 50,
      });

      cacheWithTTL.set('key1', 'value1');
      await new Promise((resolve) => setTimeout(resolve, 30));
      cacheWithTTL.set('key2', 'value2');
      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(cacheWithTTL.get('key1')).toBeUndefined();
      expect(cacheWithTTL.get('key2')).toBe('value2');
    });
  });

  describe('Statistics', () => {
    it('should track hits and misses', () => {
      cache.set('key1', 'value1');

      cache.get('key1'); // Hit
      cache.get('key2'); // Miss
      cache.get('key1'); // Hit

      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBeCloseTo(0.667, 2);
    });

    it('should track evictions', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4'); // Eviction

      const stats = cache.getStats();
      expect(stats.evictions).toBe(1);
    });

    it('should report current size and max size', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      const stats = cache.getStats();
      expect(stats.size).toBe(2);
      expect(stats.maxSize).toBe(3);
    });

    it('should estimate memory usage', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      const stats = cache.getStats();
      expect(stats.approximateMemoryBytes).toBeGreaterThan(0);
    });

    it('should reset stats', () => {
      cache.set('key1', 'value1');
      cache.get('key1');
      cache.get('key2');

      cache.resetStats();

      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.evictions).toBe(0);
    });

    it('should handle zero operations gracefully', () => {
      const stats = cache.getStats();
      expect(stats.hitRate).toBe(0);
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });

  describe('Custom Size Estimator', () => {
    it('should use custom size estimator', () => {
      const customCache = new EnhancedLRU<string, { data: string }>({
        maxSize: 10,
        estimateSize: (value) => {
          if (typeof value === 'object' && value !== null && 'data' in value) {
            const dataValue = value as { data: string };
            return dataValue.data.length * 2;
          }
          return 100;
        },
      });

      customCache.set('key1', { data: 'short' });
      customCache.set('key2', { data: 'much longer string' });

      const stats = customCache.getStats();
      expect(stats.approximateMemoryBytes).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined values', () => {
      cache.set('key1', undefined as unknown as string);
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.has('key1')).toBe(true);
    });

    it('should handle empty strings', () => {
      cache.set('key1', '');
      expect(cache.get('key1')).toBe('');
    });

    it('should handle numeric keys', () => {
      const numCache = new EnhancedLRU<number, string>({ maxSize: 3 });
      numCache.set(1, 'one');
      numCache.set(2, 'two');
      expect(numCache.get(1)).toBe('one');
    });

    it('should handle object values', () => {
      const objCache = new EnhancedLRU<string, { value: number }>({ maxSize: 3 });
      objCache.set('key1', { value: 42 });
      expect(objCache.get('key1')).toEqual({ value: 42 });
    });
  });

  describe('Singleton Caches', () => {
    it('should provide global cache stats', () => {
      const stats = getAllCacheStats();

      expect(stats).toHaveProperty('assetKeyCache');
      expect(stats).toHaveProperty('typeDerivationCache');
      expect(stats.assetKeyCache).toHaveProperty('hits');
      expect(stats.typeDerivationCache).toHaveProperty('hits');
    });
  });

  describe('Performance', () => {
    it('should handle large number of operations efficiently', () => {
      const largeCache = new EnhancedLRU<number, string>({ maxSize: 1000 });

      const start = performance.now();

      for (let i = 0; i < 10000; i++) {
        largeCache.set(i, `value${i}`);
        largeCache.get(i % 1000);
      }

      const duration = performance.now() - start;

      // Should complete in reasonable time
      expect(duration).toBeLessThan(100);
    });

    it('should maintain constant time operations', () => {
      const measurements: number[] = [];

      for (let size = 100; size <= 1000; size += 100) {
        const testCache = new EnhancedLRU<number, string>({ maxSize: size });

        const start = performance.now();
        for (let i = 0; i < 1000; i++) {
          testCache.set(i, `value${i}`);
        }
        const duration = performance.now() - start;

        measurements.push(duration);
      }

      // Operations should be roughly constant time (within 10x variance to account for system variability)
      const min = Math.min(...measurements);
      const max = Math.max(...measurements);
      expect(max / min).toBeLessThan(10);
    });
  });
});
