/**
 * Postgres Type Mapping Tests
 * 
 * Verifies invariants from Canon Architecture §8.1
 * Tests: M1 (full coverage), M2 (strict mode), M3 (confidence tracking)
 */

import { describe, expect, it } from 'vitest';
import {
  CONFIDENCE_SEMANTICS,
  POSTGRES_TO_CANON,
  mapPostgresColumn,
  mapPostgresType,
  normalizePgType,
  type MapPostgresColumnInput,
} from '../postgres-types';

describe('Postgres Type Mapping', () => {
  describe('M1: Full coverage of known Postgres types', () => {
    it('should map all text types', () => {
      expect(POSTGRES_TO_CANON['text']).toBe('long_text');
      expect(POSTGRES_TO_CANON['varchar']).toBe('short_text');
      expect(POSTGRES_TO_CANON['character varying']).toBe('short_text');
      expect(POSTGRES_TO_CANON['char']).toBe('short_text');
      expect(POSTGRES_TO_CANON['character']).toBe('short_text');
      expect(POSTGRES_TO_CANON['name']).toBe('short_text');
      expect(POSTGRES_TO_CANON['citext']).toBe('long_text');
    });

    it('should map all numeric types', () => {
      expect(POSTGRES_TO_CANON['int2']).toBe('integer');
      expect(POSTGRES_TO_CANON['int4']).toBe('integer');
      expect(POSTGRES_TO_CANON['int8']).toBe('integer');
      expect(POSTGRES_TO_CANON['smallint']).toBe('integer');
      expect(POSTGRES_TO_CANON['integer']).toBe('integer');
      expect(POSTGRES_TO_CANON['bigint']).toBe('integer');
      expect(POSTGRES_TO_CANON['float4']).toBe('decimal');
      expect(POSTGRES_TO_CANON['float8']).toBe('decimal');
      expect(POSTGRES_TO_CANON['real']).toBe('decimal');
      expect(POSTGRES_TO_CANON['double precision']).toBe('decimal');
      expect(POSTGRES_TO_CANON['numeric']).toBe('decimal');
      expect(POSTGRES_TO_CANON['money']).toBe('decimal');
    });

    it('should map boolean types', () => {
      expect(POSTGRES_TO_CANON['bool']).toBe('boolean');
      expect(POSTGRES_TO_CANON['boolean']).toBe('boolean');
    });

    it('should map date/time types', () => {
      expect(POSTGRES_TO_CANON['date']).toBe('date');
      expect(POSTGRES_TO_CANON['timestamp']).toBe('datetime');
      expect(POSTGRES_TO_CANON['timestamp without time zone']).toBe('datetime');
      expect(POSTGRES_TO_CANON['timestamp with time zone']).toBe('datetime');
      expect(POSTGRES_TO_CANON['timestamptz']).toBe('datetime');
    });

    it('should map JSON types', () => {
      expect(POSTGRES_TO_CANON['json']).toBe('json');
      expect(POSTGRES_TO_CANON['jsonb']).toBe('json');
    });

    it('should map binary types', () => {
      expect(POSTGRES_TO_CANON['bytea']).toBe('binary');
    });

    it('should map UUID to entity_ref', () => {
      expect(POSTGRES_TO_CANON['uuid']).toBe('entity_ref');
    });

    it('should map array types', () => {
      expect(POSTGRES_TO_CANON['text[]']).toBe('multi_select');
      expect(POSTGRES_TO_CANON['varchar[]']).toBe('multi_select');
      expect(POSTGRES_TO_CANON['integer[]']).toBe('json');
      expect(POSTGRES_TO_CANON['int4[]']).toBe('json');
    });
  });

  describe('M2: Strict mode throws on unknown types', () => {
    it('should throw on unknown type in strict mode', () => {
      expect(() =>
        mapPostgresType('unknown_type', {}, { mode: 'strict' })
      ).toThrow();
    });

    it('should return fallback in loose mode', () => {
      const result = mapPostgresType('unknown_type', {}, { mode: 'loose' });
      expect(result.canonType).toBe('short_text');
      expect(result.confidence).toBeLessThan(1.0);
    });

    it('should handle known types without throwing', () => {
      expect(() =>
        mapPostgresType('text', {}, { mode: 'strict' })
      ).not.toThrow();

      expect(() =>
        mapPostgresType('integer', {}, { mode: 'strict' })
      ).not.toThrow();
    });
  });

  describe('M3: Confidence tracking', () => {
    it('should return high confidence for exact mappings', () => {
      const result = mapPostgresType('text');
      expect(result.confidence).toBeGreaterThanOrEqual(CONFIDENCE_SEMANTICS.SEMANTIC_EQUIV);
    });

    it('should return lower confidence for lossy mappings', () => {
      const result = mapPostgresType('unknown_type', {}, { mode: 'loose' });
      expect(result.confidence).toBe(CONFIDENCE_SEMANTICS.LOSSY_FALLBACK);
    });

    it('should include notes for lossy or special mappings', () => {
      // Standard mappings may not have notes
      const standardResult = mapPostgresType('text');
      expect(standardResult).toBeDefined();

      // Lossy mappings should have notes
      const lossyResult = mapPostgresType('unknown_type', {}, { mode: 'loose' });
      expect(lossyResult.notes).toBeDefined();
      expect(lossyResult.notes).toContain('unknown');
    });

    it('should track confidence for narrowing conversions', () => {
      const result = mapPostgresType('uuid');
      expect(result.confidence).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1.0);
    });
  });

  describe('normalizePgType', () => {
    it('should detect array types with [] suffix', () => {
      const result = normalizePgType('text[]');
      expect(result.isArray).toBe(true);
      expect(result.baseType).toBe('text');
    });

    it('should detect array types with _ prefix', () => {
      const result = normalizePgType('_text');
      expect(result.isArray).toBe(true);
      expect(result.baseType).toBe('text');
    });

    it('should handle non-array types', () => {
      const result = normalizePgType('text');
      expect(result.isArray).toBe(false);
      expect(result.baseType).toBe('text');
    });

    it('should detect composite types', () => {
      const result = normalizePgType('public.custom_type');
      expect(result.isComposite).toBe(true);
    });

    it('should lowercase type names', () => {
      const result = normalizePgType('TEXT');
      expect(result.baseType).toBe('text');
    });
  });

  describe('mapPostgresColumn', () => {
    it('should map a complete column with metadata', () => {
      const input: MapPostgresColumnInput = {
        columnName: 'email',
        udtName: 'varchar',
        isNullable: false,
        characterMaximumLength: 255,
      };

      const result = mapPostgresColumn(input);

      expect(result.canonType).toBe('short_text');
      expect(result.isRequired).toBe(true);
      expect(result.maxLength).toBe(255);
      expect(result.confidence).toBeDefined();
    });

    it('should handle numeric columns with precision/scale', () => {
      const input: MapPostgresColumnInput = {
        columnName: 'price',
        udtName: 'numeric',
        isNullable: false,
        numericPrecision: 10,
        numericScale: 2,
      };

      const result = mapPostgresColumn(input);

      expect(result.canonType).toBe('decimal');
      expect(result.isRequired).toBe(true);
      expect(result.precision).toBe(10);
      expect(result.scale).toBe(2);
    });

    it('should handle nullable columns', () => {
      const input: MapPostgresColumnInput = {
        columnName: 'description',
        udtName: 'text',
        isNullable: true,
      };

      const result = mapPostgresColumn(input);

      expect(result.canonType).toBe('long_text');
      expect(result.isRequired).toBe(false);
    });

    it('should handle columns without metadata', () => {
      const input: MapPostgresColumnInput = {
        columnName: 'id',
        udtName: 'uuid',
        isNullable: false,
      };

      const result = mapPostgresColumn(input);

      expect(result.canonType).toBe('entity_ref');
      expect(result.isRequired).toBe(true);
      expect(result.maxLength).toBeUndefined();
      expect(result.precision).toBeUndefined();
    });
  });

  describe('CONFIDENCE_SEMANTICS', () => {
    it('should define all confidence levels', () => {
      expect(CONFIDENCE_SEMANTICS.EXACT).toBe(1.0);
      expect(CONFIDENCE_SEMANTICS.SEMANTIC_EQUIV).toBe(0.95);
      expect(CONFIDENCE_SEMANTICS.NARROWING_WITH_METADATA).toBe(0.8);
      expect(CONFIDENCE_SEMANTICS.LOSSY_FALLBACK).toBe(0.4);
    });

    it('should have descending confidence values', () => {
      expect(CONFIDENCE_SEMANTICS.EXACT).toBeGreaterThan(CONFIDENCE_SEMANTICS.SEMANTIC_EQUIV);
      expect(CONFIDENCE_SEMANTICS.SEMANTIC_EQUIV).toBeGreaterThan(CONFIDENCE_SEMANTICS.NARROWING_WITH_METADATA);
      expect(CONFIDENCE_SEMANTICS.NARROWING_WITH_METADATA).toBeGreaterThan(CONFIDENCE_SEMANTICS.LOSSY_FALLBACK);
    });
  });

  describe('Edge cases', () => {
    it('should handle case-insensitive type names', () => {
      const result1 = mapPostgresType('TEXT');
      const result2 = mapPostgresType('text');
      expect(result1.canonType).toBe(result2.canonType);
    });

    it('should handle types with extra whitespace', () => {
      const result = mapPostgresType('  text  ');
      expect(result.canonType).toBe('long_text');
    });

    it('should handle serial types as integers', () => {
      expect(POSTGRES_TO_CANON['serial']).toBe('integer');
      expect(POSTGRES_TO_CANON['bigserial']).toBe('integer');
      expect(POSTGRES_TO_CANON['smallserial']).toBe('integer');
    });

    it('should map time types to short_text (no native time type)', () => {
      expect(POSTGRES_TO_CANON['time']).toBe('short_text');
      expect(POSTGRES_TO_CANON['time without time zone']).toBe('short_text');
      expect(POSTGRES_TO_CANON['time with time zone']).toBe('short_text');
    });

    it('should map interval to short_text', () => {
      expect(POSTGRES_TO_CANON['interval']).toBe('short_text');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle a typical user table column mapping', () => {
      const columns: MapPostgresColumnInput[] = [
        { columnName: 'id', udtName: 'uuid', isNullable: false },
        { columnName: 'email', udtName: 'varchar', isNullable: false, characterMaximumLength: 255 },
        { columnName: 'name', udtName: 'text', isNullable: false },
        { columnName: 'age', udtName: 'int4', isNullable: true },
        { columnName: 'created_at', udtName: 'timestamptz', isNullable: false },
        { columnName: 'is_active', udtName: 'bool', isNullable: false },
      ];

      const results = columns.map(mapPostgresColumn);

      // Safe to use non-null assertions here - test data is known to be valid
      expect(results[0]!.canonType).toBe('entity_ref');
      expect(results[1]!.canonType).toBe('short_text');
      expect(results[2]!.canonType).toBe('long_text');
      expect(results[3]!.canonType).toBe('integer');
      expect(results[4]!.canonType).toBe('datetime');
      expect(results[5]!.canonType).toBe('boolean');

      // All should have confidence scores
      results.forEach(result => {
        expect(result.confidence).toBeDefined();
        expect(result.confidence).toBeGreaterThan(0);
      });
    });
  });
});
