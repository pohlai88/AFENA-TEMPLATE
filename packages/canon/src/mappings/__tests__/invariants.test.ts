/**
 * Mapping Invariants Tests
 *
 * Verifies correctness invariants:
 * - Reason code ordering is stable
 * - At least one reason code always present
 * - LOSSY_FALLBACK implies warnings
 * - Fallback always returns warnings array
 */

import { describe, expect, it } from 'vitest';
import { inferCsvColumnType } from '../csv-types';
import { applyUnknownTypePolicy } from '../policy';
import { mapPostgresType } from '../postgres-types';
import { buildReasonCodes } from '../reason-codes';
import { ScopedTypeMappingRegistry } from '../registry';

describe('Mapping Invariants', () => {
  describe('INV: Reason code ordering is stable', () => {
    it('should produce same order regardless of input flag order', () => {
      const codes1 = buildReasonCodes({
        primary: 'LOSSY_FALLBACK',
        flags: ['UNKNOWN_PG_TYPE', 'DOMAIN_TYPE_DETECTED'],
      });

      const codes2 = buildReasonCodes({
        primary: 'LOSSY_FALLBACK',
        flags: ['DOMAIN_TYPE_DETECTED', 'UNKNOWN_PG_TYPE'], // Different order
      });

      expect(codes1).toEqual(codes2); // Same result
    });

    it('should deduplicate flags', () => {
      const codes = buildReasonCodes({
        primary: 'LOSSY_FALLBACK',
        flags: ['UNKNOWN_PG_TYPE', 'UNKNOWN_PG_TYPE', 'DOMAIN_TYPE_DETECTED'],
      });

      expect(codes).toEqual(['LOSSY_FALLBACK', 'DOMAIN_TYPE_DETECTED', 'UNKNOWN_PG_TYPE']);
    });

    it('should always have primary code first', () => {
      const codes = buildReasonCodes({
        primary: 'EXACT_MATCH',
        flags: ['CUSTOM_MAPPING', 'CSV_HINT_MATCH'],
      });

      expect(codes[0]).toBe('EXACT_MATCH');
    });
  });

  describe('INV: At least one reason code always present', () => {
    it('postgres mapping should always have reason codes', () => {
      const result = mapPostgresType('varchar', { maxLength: 255 });
      expect(result.reasonCodes.length).toBeGreaterThan(0);
    });

    it('csv inference should always have reason codes', () => {
      const result = inferCsvColumnType(['test', 'data']);
      expect(result.reasonCodes.length).toBeGreaterThan(0);
    });

    it('even empty CSV should have reason codes', () => {
      const result = inferCsvColumnType([]);
      expect(result.reasonCodes.length).toBeGreaterThan(0);
      expect(result.reasonCodes).toContain('LOSSY_FALLBACK');
    });
  });

  describe('INV: LOSSY_FALLBACK implies warnings', () => {
    it('postgres unknown type in loose mode should have warnings', () => {
      const result = mapPostgresType('unknown_custom_type', {}, { mode: 'loose' });

      if (result.reasonCodes.includes('LOSSY_FALLBACK')) {
        expect(result.warnings.length).toBeGreaterThan(0);
      }
    });

    it('csv mostly empty should have warnings', () => {
      const result = inferCsvColumnType(['', '', 'x']);

      if (result.reasonCodes.includes('LOSSY_FALLBACK')) {
        expect(result.warnings.length).toBeGreaterThan(0);
      }
    });

    it('policy fallback should always have warnings', () => {
      const error = new Error('Unknown type');
      const result = applyUnknownTypePolicy(error, 'custom_type', {
        action: 'warn_and_fallback',
        fallbackType: 'long_text',
      });

      expect(result.reasonCodes).toContain('LOSSY_FALLBACK');
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('INV: Warnings array always present', () => {
    it('successful postgres mapping should have warnings array', () => {
      const result = mapPostgresType('varchar', { maxLength: 255 });
      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    it('successful csv inference should have warnings array', () => {
      const result = inferCsvColumnType(['1', '2', '3']);
      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    it('warnings array can be empty for successful mappings', () => {
      const result = mapPostgresType('integer');
      expect(result.warnings).toEqual([]);
    });
  });

  describe('INV: Registry conflict resolution', () => {
    it('should prevent override when allowOverride=false', () => {
      const registry = new ScopedTypeMappingRegistry();

      registry.register({
        pgType: 'custom_type',
        canonType: 'short_text',
        confidence: 1.0,
        reasonCodes: ['EXACT_MATCH'],
        source: 'system',
        priority: 10,
        allowOverride: false,
      });

      expect(() => {
        registry.register({
          pgType: 'custom_type',
          canonType: 'long_text',
          confidence: 1.0,
          reasonCodes: ['EXACT_MATCH'],
          source: 'org',
          priority: 20, // Higher priority but override not allowed
          allowOverride: true,
        });
      }).toThrow(/allowOverride=false/);
    });

    it('should prevent override with lower priority', () => {
      const registry = new ScopedTypeMappingRegistry();

      registry.register({
        pgType: 'custom_type',
        canonType: 'short_text',
        confidence: 1.0,
        reasonCodes: ['EXACT_MATCH'],
        source: 'system',
        priority: 10,
        allowOverride: true,
      });

      expect(() => {
        registry.register({
          pgType: 'custom_type',
          canonType: 'long_text',
          confidence: 1.0,
          reasonCodes: ['EXACT_MATCH'],
          source: 'org',
          priority: 5, // Lower priority
          allowOverride: true,
        });
      }).toThrow(/higher-priority/);
    });

    it('should use source rank for tie-breaking', () => {
      const registry = new ScopedTypeMappingRegistry();

      registry.register({
        pgType: 'custom_type',
        canonType: 'short_text',
        confidence: 1.0,
        reasonCodes: ['EXACT_MATCH'],
        source: 'system', // Rank 3
        priority: 10,
        allowOverride: true,
      });

      // Migration (rank 1) cannot override system (rank 3) at same priority
      expect(() => {
        registry.register({
          pgType: 'custom_type',
          canonType: 'long_text',
          confidence: 1.0,
          reasonCodes: ['EXACT_MATCH'],
          source: 'migration',
          priority: 10, // Same priority
          allowOverride: true,
        });
      }).toThrow(/tie-break/);
    });

    it('should allow override with higher priority', () => {
      const registry = new ScopedTypeMappingRegistry();

      registry.register({
        pgType: 'custom_type',
        canonType: 'short_text',
        confidence: 1.0,
        reasonCodes: ['EXACT_MATCH'],
        source: 'migration',
        priority: 5,
        allowOverride: true,
      });

      // Should succeed - higher priority
      registry.register({
        pgType: 'custom_type',
        canonType: 'long_text',
        confidence: 1.0,
        reasonCodes: ['EXACT_MATCH'],
        source: 'org',
        priority: 10,
        allowOverride: true,
      });

      const resolved = registry.resolve('custom_type');
      expect(resolved?.canonType).toBe('long_text');
      expect(resolved?.source).toBe('org');
    });
  });

  describe('INV: Determinism across runs', () => {
    it('same input should produce same output', () => {
      const result1 = mapPostgresType('varchar', { maxLength: 255 });
      const result2 = mapPostgresType('varchar', { maxLength: 255 });

      expect(result1.canonType).toBe(result2.canonType);
      expect(result1.confidence).toBe(result2.confidence);
      expect(result1.reasonCodes).toEqual(result2.reasonCodes);
    });

    it('csv inference should be deterministic', () => {
      const values = ['1', '2', '3', '4', '5'];
      const result1 = inferCsvColumnType(values, { sampleStrategy: 'head' });
      const result2 = inferCsvColumnType(values, { sampleStrategy: 'head' });

      expect(result1.canonType).toBe(result2.canonType);
      expect(result1.reasonCodes).toEqual(result2.reasonCodes);
    });
  });

  describe('INV: CSV distinct value logic', () => {
    it('low distinct values should suggest enum', () => {
      const result = inferCsvColumnType([
        'active',
        'inactive',
        'active',
        'pending',
        'active',
        'inactive',
      ]);

      expect(result.canonType).toBe('enum');
      expect(result.reasonCodes).toContain('LOW_DISTINCT_VALUES');
    });

    it('high distinct values should suggest text', () => {
      const values = Array.from({ length: 200 }, (_, i) => `value_${i}`);
      const result = inferCsvColumnType(values);

      expect(['short_text', 'long_text']).toContain(result.canonType);
      expect(result.reasonCodes).toContain('HIGH_DISTINCT_VALUES');
    });

    it('boolean-like low distinct should infer boolean', () => {
      const result = inferCsvColumnType(['true', 'false', 'true', 'true', 'false']);

      expect(result.canonType).toBe('boolean');
      expect(result.reasonCodes).toContain('LOW_DISTINCT_VALUES');
    });
  });
});
