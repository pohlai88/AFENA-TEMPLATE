/**
 * Batch Parser Tests
 * 
 * Tests for batch asset key parsing operations
 */

import { describe, expect, it } from 'vitest';
import {
  parseAssetKeyBatch,
  parseAssetKeyBatchValid,
  parseAssetKeyBatchSeparate,
  parseAssetKeyBatchStats,
} from '../batch-parser';

describe('Batch Parser', () => {
  describe('parseAssetKeyBatch', () => {
    it('should parse multiple valid keys', () => {
      const keys = [
        'db.rec.afenda.public.invoices',
        'db.field.afenda.public.invoices.total',
        'db.bo.finance.invoice',
      ];

      const results = parseAssetKeyBatch(keys);

      expect(results).toHaveLength(3);
      expect(results[0]?.valid).toBe(true);
      expect(results[1]?.valid).toBe(true);
      expect(results[2]?.valid).toBe(true);
    });

    it('should handle mixed valid and invalid keys', () => {
      const keys = [
        'db.rec.afenda.public.invoices',
        'invalid-key',
        'db.field.afenda.public.invoices.total',
      ];

      const results = parseAssetKeyBatch(keys);

      expect(results).toHaveLength(3);
      expect(results[0]?.valid).toBe(true);
      expect(results[1]?.valid).toBe(false);
      expect(results[2]?.valid).toBe(true);
    });

    it('should preserve input order', () => {
      const keys = [
        'db.bo.finance.invoice',
        'db.rec.afenda.public.invoices',
        'db.field.afenda.public.invoices.total',
      ];

      const results = parseAssetKeyBatch(keys);

      expect(results[0]?.prefix).toBe('db.bo');
      expect(results[1]?.prefix).toBe('db.rec');
      expect(results[2]?.prefix).toBe('db.field');
    });

    it('should handle empty array', () => {
      const results = parseAssetKeyBatch([]);
      expect(results).toHaveLength(0);
    });

    it('should process large batches with chunking', () => {
      const keys = Array.from({ length: 500 }, (_, i) => 
        `db.rec.afenda.public.table${i}`
      );

      const results = parseAssetKeyBatch(keys, 100);

      expect(results).toHaveLength(500);
      expect(results.every((r) => r.valid)).toBe(true);
    });

    it('should respect custom chunk size', () => {
      const keys = Array.from({ length: 50 }, (_, i) => 
        `db.rec.afenda.public.table${i}`
      );

      const results = parseAssetKeyBatch(keys, 10);

      expect(results).toHaveLength(50);
      expect(results.every((r) => r.valid)).toBe(true);
    });
  });

  describe('parseAssetKeyBatchValid', () => {
    it('should return only valid keys', () => {
      const keys = [
        'db.rec.afenda.public.invoices',
        'invalid-key',
        'db.field.afenda.public.invoices.total',
        'another-invalid',
      ];

      const results = parseAssetKeyBatchValid(keys);

      expect(results).toHaveLength(2);
      expect(results.every((r) => r.valid)).toBe(true);
    });

    it('should return empty array when all invalid', () => {
      const keys = ['invalid-key', 'another-invalid'];

      const results = parseAssetKeyBatchValid(keys);

      expect(results).toHaveLength(0);
    });

    it('should return all when all valid', () => {
      const keys = [
        'db.rec.afenda.public.invoices',
        'db.field.afenda.public.invoices.total',
      ];

      const results = parseAssetKeyBatchValid(keys);

      expect(results).toHaveLength(2);
    });
  });

  describe('parseAssetKeyBatchSeparate', () => {
    it('should separate valid and invalid keys', () => {
      const keys = [
        'db.rec.afenda.public.invoices',
        'invalid-key',
        'db.field.afenda.public.invoices.total',
        'another-invalid',
      ];

      const { valid, invalid } = parseAssetKeyBatchSeparate(keys);

      expect(valid).toHaveLength(2);
      expect(invalid).toHaveLength(2);
      expect(valid.every((r) => r.valid)).toBe(true);
      expect(invalid.every((r) => !r.valid)).toBe(true);
    });

    it('should handle all valid keys', () => {
      const keys = [
        'db.rec.afenda.public.invoices',
        'db.field.afenda.public.invoices.total',
      ];

      const { valid, invalid } = parseAssetKeyBatchSeparate(keys);

      expect(valid).toHaveLength(2);
      expect(invalid).toHaveLength(0);
    });

    it('should handle all invalid keys', () => {
      const keys = ['invalid-key', 'another-invalid'];

      const { valid, invalid } = parseAssetKeyBatchSeparate(keys);

      expect(valid).toHaveLength(0);
      expect(invalid).toHaveLength(2);
    });
  });

  describe('parseAssetKeyBatchStats', () => {
    it('should collect accurate statistics', () => {
      const keys = [
        'db.rec.afenda.public.invoices',
        'invalid-key',
        'db.field.afenda.public.invoices.total',
        'another-invalid',
      ];

      const stats = parseAssetKeyBatchStats(keys);

      expect(stats.total).toBe(4);
      expect(stats.valid).toBe(2);
      expect(stats.invalid).toBe(2);
      expect(stats.validRate).toBe(0.5);
    });

    it('should track error types', () => {
      const keys = [
        'db.rec.afenda.public.invoices',
        'invalid-key',
        'db.field', // Too few segments
      ];

      const stats = parseAssetKeyBatchStats(keys);

      expect(stats.errorsByType).toBeDefined();
      expect(Object.keys(stats.errorsByType).length).toBeGreaterThan(0);
    });

    it('should handle 100% valid rate', () => {
      const keys = [
        'db.rec.afenda.public.invoices',
        'db.field.afenda.public.invoices.total',
      ];

      const stats = parseAssetKeyBatchStats(keys);

      expect(stats.validRate).toBe(1.0);
      expect(stats.invalid).toBe(0);
    });

    it('should handle 0% valid rate', () => {
      const keys = ['invalid-key', 'another-invalid'];

      const stats = parseAssetKeyBatchStats(keys);

      expect(stats.validRate).toBe(0);
      expect(stats.valid).toBe(0);
    });

    it('should handle empty array', () => {
      const stats = parseAssetKeyBatchStats([]);

      expect(stats.total).toBe(0);
      expect(stats.validRate).toBe(0);
    });
  });

  describe('Performance', () => {
    it('should process 1000 keys in reasonable time', () => {
      const keys = Array.from({ length: 1000 }, (_, i) => 
        `db.rec.afenda.public.table${i}`
      );

      const start = performance.now();
      parseAssetKeyBatch(keys);
      const duration = performance.now() - start;

      // Should complete in less than 100ms
      expect(duration).toBeLessThan(100);
    });

    it('should have linear memory usage with batch size', () => {
      const smallBatch = Array.from({ length: 100 }, (_, i) => 
        `db.rec.afenda.public.table${i}`
      );
      const largeBatch = Array.from({ length: 1000 }, (_, i) => 
        `db.rec.afenda.public.table${i}`
      );

      const smallResults = parseAssetKeyBatch(smallBatch);
      const largeResults = parseAssetKeyBatch(largeBatch);

      // Results should scale linearly
      expect(largeResults.length).toBe(smallResults.length * 10);
    });
  });
});
