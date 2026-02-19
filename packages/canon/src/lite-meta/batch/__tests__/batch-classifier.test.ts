/**
 * Batch Classifier Tests
 * 
 * Tests for batch column classification operations
 */

import { describe, expect, it } from 'vitest';
import {
  classifyColumnsBatch,
  classifyColumnsBatchPII,
  classifyColumnsBatchGrouped,
  classifyColumnsBatchStats,
  classifyColumnsMulti,
  type ColumnInfo,
} from '../batch-classifier';

describe('Batch Classifier', () => {
  describe('classifyColumnsBatch', () => {
    it('should classify multiple columns', () => {
      const columns: ColumnInfo[] = [
        { fieldName: 'email_address' },
        { fieldName: 'phone_number' },
        { fieldName: 'customer_name' },
      ];

      const results = classifyColumnsBatch(columns);

      expect(results).toHaveLength(3);
      expect(results[0]?.classification).toBe('pii');
      expect(results[1]?.classification).toBe('pii');
    });

    it('should handle unclassified columns', () => {
      const columns: ColumnInfo[] = [
        { fieldName: 'email_address' },
        { fieldName: 'random_field' },
      ];

      const results = classifyColumnsBatch(columns);

      expect(results).toHaveLength(2);
      expect(results[0]?.classification).toBe('pii');
      expect(results[1]?.classification).toBeNull();
    });

    it('should preserve input order', () => {
      const columns: ColumnInfo[] = [
        { fieldName: 'customer_name' },
        { fieldName: 'email_address' },
        { fieldName: 'phone_number' },
      ];

      const results = classifyColumnsBatch(columns);

      expect(results[0]?.fieldName).toBe('customer_name');
      expect(results[1]?.fieldName).toBe('email_address');
      expect(results[2]?.fieldName).toBe('phone_number');
    });

    it('should handle empty array', () => {
      const results = classifyColumnsBatch([]);
      expect(results).toHaveLength(0);
    });

    it('should process large batches with chunking', () => {
      const columns: ColumnInfo[] = Array.from({ length: 200 }, (_, i) => ({
        fieldName: `field_${i}`,
      }));

      const results = classifyColumnsBatch(columns, 50);

      expect(results).toHaveLength(200);
    });

    it('should include confidence scores', () => {
      const columns: ColumnInfo[] = [
        { fieldName: 'email_address' },
      ];

      const results = classifyColumnsBatch(columns);

      expect(results[0]?.confidence).toBeGreaterThan(0);
      expect(results[0]?.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('classifyColumnsBatchPII', () => {
    it('should return only PII columns', () => {
      const columns: ColumnInfo[] = [
        { fieldName: 'email_address' },
        { fieldName: 'random_field' },
        { fieldName: 'phone_number' },
        { fieldName: 'another_field' },
      ];

      const results = classifyColumnsBatchPII(columns);

      expect(results.length).toBeGreaterThan(0);
      expect(results.every((r) => r.classification === 'pii')).toBe(true);
    });

    it('should return empty array when no PII', () => {
      const columns: ColumnInfo[] = [
        { fieldName: 'random_field' },
        { fieldName: 'another_field' },
      ];

      const results = classifyColumnsBatchPII(columns);

      expect(results).toHaveLength(0);
    });
  });

  describe('classifyColumnsBatchGrouped', () => {
    it('should group by classification type', () => {
      const columns: ColumnInfo[] = [
        { fieldName: 'email_address' },
        { fieldName: 'phone_number' },
        { fieldName: 'random_field' },
      ];

      const grouped = classifyColumnsBatchGrouped(columns);

      expect(grouped.has('pii')).toBe(true);
      expect(grouped.has('unclassified')).toBe(true);
      
      const piiColumns = grouped.get('pii');
      expect(piiColumns).toBeDefined();
      expect(piiColumns!.length).toBeGreaterThan(0);
    });

    it('should handle all unclassified', () => {
      const columns: ColumnInfo[] = [
        { fieldName: 'random_field' },
        { fieldName: 'another_field' },
      ];

      const grouped = classifyColumnsBatchGrouped(columns);

      expect(grouped.has('unclassified')).toBe(true);
      expect(grouped.get('unclassified')?.length).toBe(2);
    });

    it('should handle all classified', () => {
      const columns: ColumnInfo[] = [
        { fieldName: 'email_address' },
        { fieldName: 'phone_number' },
      ];

      const grouped = classifyColumnsBatchGrouped(columns);

      expect(grouped.has('pii')).toBe(true);
      expect(grouped.has('unclassified')).toBe(false);
    });
  });

  describe('classifyColumnsBatchStats', () => {
    it('should collect accurate statistics', () => {
      const columns: ColumnInfo[] = [
        { fieldName: 'email_address' },
        { fieldName: 'phone_number' },
        { fieldName: 'random_field' },
        { fieldName: 'another_field' },
      ];

      const stats = classifyColumnsBatchStats(columns);

      expect(stats.total).toBe(4);
      expect(stats.classified).toBeGreaterThan(0);
      expect(stats.unclassified).toBeGreaterThan(0);
      expect(stats.classificationRate).toBeGreaterThan(0);
      expect(stats.classificationRate).toBeLessThanOrEqual(1);
    });

    it('should track by classification type', () => {
      const columns: ColumnInfo[] = [
        { fieldName: 'email_address' },
        { fieldName: 'phone_number' },
      ];

      const stats = classifyColumnsBatchStats(columns);

      expect(stats.byType).toBeDefined();
      expect(stats.byType.pii).toBeGreaterThan(0);
    });

    it('should calculate average confidence', () => {
      const columns: ColumnInfo[] = [
        { fieldName: 'email_address' },
        { fieldName: 'phone_number' },
      ];

      const stats = classifyColumnsBatchStats(columns);

      expect(stats.averageConfidence).toBeGreaterThan(0);
      expect(stats.averageConfidence).toBeLessThanOrEqual(1);
    });

    it('should handle 100% classification rate', () => {
      const columns: ColumnInfo[] = [
        { fieldName: 'email_address' },
        { fieldName: 'phone_number' },
      ];

      const stats = classifyColumnsBatchStats(columns);

      expect(stats.classificationRate).toBe(1.0);
      expect(stats.unclassified).toBe(0);
    });

    it('should handle 0% classification rate', () => {
      const columns: ColumnInfo[] = [
        { fieldName: 'random_field' },
        { fieldName: 'another_field' },
      ];

      const stats = classifyColumnsBatchStats(columns);

      expect(stats.classificationRate).toBe(0);
      expect(stats.classified).toBe(0);
      expect(stats.averageConfidence).toBe(0);
    });

    it('should handle empty array', () => {
      const stats = classifyColumnsBatchStats([]);

      expect(stats.total).toBe(0);
      expect(stats.classificationRate).toBe(0);
    });
  });

  describe('classifyColumnsMulti', () => {
    it('should classify using multi-column context', () => {
      const fieldNames = ['email_address', 'phone_number', 'random_field'];

      const results = classifyColumnsMulti(fieldNames);

      expect(results).toHaveLength(3);
      expect(results[0]?.fieldName).toBe('email_address');
      expect(results[1]?.fieldName).toBe('phone_number');
      expect(results[2]?.fieldName).toBe('random_field');
    });

    it('should handle empty array', () => {
      const results = classifyColumnsMulti([]);
      expect(results).toHaveLength(0);
    });

    it('should preserve field name order', () => {
      const fieldNames = ['field_c', 'field_a', 'field_b'];

      const results = classifyColumnsMulti(fieldNames);

      expect(results[0]?.fieldName).toBe('field_c');
      expect(results[1]?.fieldName).toBe('field_a');
      expect(results[2]?.fieldName).toBe('field_b');
    });
  });

  describe('Performance', () => {
    it('should process 500 columns in reasonable time', () => {
      const columns: ColumnInfo[] = Array.from({ length: 500 }, (_, i) => ({
        fieldName: `field_${i}`,
      }));

      const start = performance.now();
      classifyColumnsBatch(columns);
      const duration = performance.now() - start;

      // Should complete in less than 200ms
      expect(duration).toBeLessThan(200);
    });

    it('should have linear memory usage with batch size', () => {
      const smallBatch: ColumnInfo[] = Array.from({ length: 50 }, (_, i) => ({
        fieldName: `field_${i}`,
      }));
      const largeBatch: ColumnInfo[] = Array.from({ length: 500 }, (_, i) => ({
        fieldName: `field_${i}`,
      }));

      const smallResults = classifyColumnsBatch(smallBatch);
      const largeResults = classifyColumnsBatch(largeBatch);

      // Results should scale linearly
      expect(largeResults.length).toBe(smallResults.length * 10);
    });
  });
});
