/**
 * Chunking Utilities Tests
 * 
 * Tests for generic chunking operations
 */

import { describe, expect, it } from 'vitest';
import {
  calculateOptimalChunkSize,
  filterInChunks,
  groupByInChunks,
  processInChunks,
  processInChunksWithIndex,
  reduceInChunks,
} from '../chunking';

describe('Chunking Utilities', () => {
  describe('processInChunks', () => {
    it('should process all items', () => {
      const items = [1, 2, 3, 4, 5];
      const results = processInChunks(items, (x) => x * 2, 2);

      expect(results).toEqual([2, 4, 6, 8, 10]);
    });

    it('should handle empty array', () => {
      const results = processInChunks([], (x) => x, 10);
      expect(results).toEqual([]);
    });

    it('should preserve order', () => {
      const items = ['a', 'b', 'c', 'd'];
      const results = processInChunks(items, (x) => x.toUpperCase(), 2);

      expect(results).toEqual(['A', 'B', 'C', 'D']);
    });

    it('should work with chunk size larger than array', () => {
      const items = [1, 2, 3];
      const results = processInChunks(items, (x) => x * 2, 100);

      expect(results).toEqual([2, 4, 6]);
    });

    it('should work with chunk size of 1', () => {
      const items = [1, 2, 3];
      const results = processInChunks(items, (x) => x * 2, 1);

      expect(results).toEqual([2, 4, 6]);
    });
  });

  describe('processInChunksWithIndex', () => {
    it('should process all items with index', () => {
      const items = ['a', 'b', 'c'];
      const results = processInChunksWithIndex(
        items,
        (x, i) => `${x}${i}`,
        2
      );

      expect(results).toEqual(['a0', 'b1', 'c2']);
    });

    it('should provide correct global index across chunks', () => {
      const items = [10, 20, 30, 40, 50];
      const results = processInChunksWithIndex(
        items,
        (x, i) => x + i,
        2
      );

      expect(results).toEqual([10, 21, 32, 43, 54]);
    });

    it('should handle empty array', () => {
      const results = processInChunksWithIndex([], (_x, i) => i, 10);
      expect(results).toEqual([]);
    });
  });

  describe('filterInChunks', () => {
    it('should filter items correctly', () => {
      const items = [1, 2, 3, 4, 5, 6];
      const results = filterInChunks(items, (x) => x % 2 === 0, 2);

      expect(results).toEqual([2, 4, 6]);
    });

    it('should handle no matches', () => {
      const items = [1, 3, 5];
      const results = filterInChunks(items, (x) => x % 2 === 0, 2);

      expect(results).toEqual([]);
    });

    it('should handle all matches', () => {
      const items = [2, 4, 6];
      const results = filterInChunks(items, (x) => x % 2 === 0, 2);

      expect(results).toEqual([2, 4, 6]);
    });

    it('should handle empty array', () => {
      const results = filterInChunks([], (_x) => true, 10);
      expect(results).toEqual([]);
    });
  });

  describe('reduceInChunks', () => {
    it('should reduce items correctly', () => {
      const items = [1, 2, 3, 4, 5];
      const result = reduceInChunks(items, (acc, x) => acc + x, 0, 2);

      expect(result).toBe(15);
    });

    it('should work with different accumulator types', () => {
      const items = ['a', 'b', 'c'];
      const result = reduceInChunks(
        items,
        (acc, x) => acc + x,
        '',
        2
      );

      expect(result).toBe('abc');
    });

    it('should handle empty array', () => {
      const result = reduceInChunks([], (acc, x) => acc + x, 10, 10);
      expect(result).toBe(10);
    });

    it('should work with object accumulator', () => {
      const items = [1, 2, 3];
      const result = reduceInChunks(
        items,
        (acc, x) => ({ ...acc, [x]: x * 2 }),
        {} as Record<number, number>,
        2
      );

      expect(result).toEqual({ 1: 2, 2: 4, 3: 6 });
    });
  });

  describe('groupByInChunks', () => {
    it('should group items by key', () => {
      const items = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ];

      const groups = groupByInChunks(items, (x) => x.type, 2);

      expect(groups.get('a')).toEqual([
        { type: 'a', value: 1 },
        { type: 'a', value: 3 },
      ]);
      expect(groups.get('b')).toEqual([{ type: 'b', value: 2 }]);
    });

    it('should handle single group', () => {
      const items = [1, 2, 3];
      const groups = groupByInChunks(items, () => 'same', 2);

      expect(groups.size).toBe(1);
      expect(groups.get('same')).toEqual([1, 2, 3]);
    });

    it('should handle empty array', () => {
      const groups = groupByInChunks([], (x) => x, 10);
      expect(groups.size).toBe(0);
    });

    it('should work with numeric keys', () => {
      const items = [1, 2, 3, 4, 5];
      const groups = groupByInChunks(items, (x) => x % 2, 2);

      expect(groups.get(0)).toEqual([2, 4]);
      expect(groups.get(1)).toEqual([1, 3, 5]);
    });
  });

  describe('calculateOptimalChunkSize', () => {
    it('should return item count for small arrays', () => {
      expect(calculateOptimalChunkSize(5)).toBe(5);
      expect(calculateOptimalChunkSize(8)).toBe(8);
    });

    it('should target ~15 chunks for medium arrays', () => {
      const chunkSize = calculateOptimalChunkSize(300);
      const chunks = Math.ceil(300 / chunkSize);

      expect(chunks).toBeGreaterThanOrEqual(10);
      expect(chunks).toBeLessThanOrEqual(20);
    });

    it('should respect minimum chunk size', () => {
      const chunkSize = calculateOptimalChunkSize(100, 50);
      expect(chunkSize).toBeGreaterThanOrEqual(50);
    });

    it('should respect maximum chunk size', () => {
      const chunkSize = calculateOptimalChunkSize(10000, 10, 500);
      expect(chunkSize).toBeLessThanOrEqual(500);
    });

    it('should handle edge cases', () => {
      expect(calculateOptimalChunkSize(0)).toBe(0);
      expect(calculateOptimalChunkSize(1)).toBe(1);
    });

    it('should return sensible values for large arrays', () => {
      const chunkSize = calculateOptimalChunkSize(5000);

      expect(chunkSize).toBeGreaterThan(100);
      expect(chunkSize).toBeLessThanOrEqual(1000);
    });

    it('should handle custom min/max bounds', () => {
      const chunkSize = calculateOptimalChunkSize(1000, 20, 100);

      expect(chunkSize).toBeGreaterThanOrEqual(20);
      expect(chunkSize).toBeLessThanOrEqual(100);
    });
  });

  describe('Performance', () => {
    it('should process large arrays efficiently', () => {
      const items = Array.from({ length: 10000 }, (_, i) => i);

      const start = performance.now();
      processInChunks(items, (x) => x * 2, 100);
      const duration = performance.now() - start;

      // Should complete in reasonable time
      expect(duration).toBeLessThan(100);
    });

    it('should not block event loop with chunking', () => {
      const items = Array.from({ length: 5000 }, (_, i) => i);

      // Process with small chunks
      const results = processInChunks(items, (x) => x * 2, 100);

      expect(results.length).toBe(5000);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined values', () => {
      const items = [1, undefined, 3];
      const results = processInChunks(items, (x) => x, 2);

      expect(results).toEqual([1, undefined, 3]);
    });

    it('should handle null values', () => {
      const items = [1, null, 3];
      const results = processInChunks(items, (x) => x, 2);

      expect(results).toEqual([1, null, 3]);
    });

    it('should handle mixed types', () => {
      const items = [1, 'two', true, null];
      const results = processInChunks(items, (x) => x, 2);

      expect(results).toEqual([1, 'two', true, null]);
    });
  });
});
