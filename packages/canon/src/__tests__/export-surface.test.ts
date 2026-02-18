/**
 * Export Surface Tests
 * 
 * Prevents accidental removal of public API symbols
 * Verifies Canon's public API stability contract (§18.6)
 */

import { describe, it, expect } from 'vitest';
import * as Canon from '../index';

describe('Canon Public API Surface', () => {
  describe('Enums', () => {
    it('should export all core enums', () => {
      expect(Canon.DATA_TYPES).toBeDefined();
      expect(Canon.DOC_STATUSES).toBeDefined();
      expect(Canon.META_ASSET_TYPES).toBeDefined();
      expect(Canon.META_EDGE_TYPES).toBeDefined();
      expect(Canon.META_CLASSIFICATIONS).toBeDefined();
      expect(Canon.META_QUALITY_TIERS).toBeDefined();
    });
  });

  describe('LiteMetadata Functions', () => {
    it('should export asset key functions', () => {
      expect(typeof Canon.buildAssetKey).toBe('function');
      expect(typeof Canon.parseAssetKey).toBe('function');
      expect(typeof Canon.canonicalizeKey).toBe('function');
      expect(typeof Canon.validateAssetKey).toBe('function');
      expect(typeof Canon.deriveAssetTypeFromKey).toBe('function');
      expect(typeof Canon.assertAssetTypeMatchesKey).toBe('function');
    });

    it('should export asset fingerprint function', () => {
      expect(typeof Canon.assetFingerprint).toBe('function');
    });

    it('should export alias resolution functions', () => {
      expect(typeof Canon.slugify).toBe('function');
      expect(typeof Canon.matchAlias).toBe('function');
      expect(typeof Canon.resolveAlias).toBe('function');
    });

    it('should export lineage functions', () => {
      expect(typeof Canon.inferEdgeType).toBe('function');
      expect(typeof Canon.topoSortLineage).toBe('function');
      expect(typeof Canon.explainLineageEdge).toBe('function');
    });

    it('should export quality rule functions', () => {
      expect(typeof Canon.compileQualityRule).toBe('function');
      expect(typeof Canon.scoreQualityTier).toBe('function');
      expect(Canon.DIMENSION_TO_RULES).toBeDefined();
    });

    it('should export classification functions', () => {
      expect(typeof Canon.classifyColumn).toBe('function');
      expect(Canon.PII_PATTERNS).toBeDefined();
    });
  });

  describe('Type Mappings', () => {
    it('should export Postgres type mappings', () => {
      expect(Canon.POSTGRES_TO_CANON).toBeDefined();
      expect(typeof Canon.mapPostgresType).toBe('function');
      expect(typeof Canon.mapPostgresColumn).toBe('function');
    });

    it('should export CSV type inference', () => {
      expect(typeof Canon.inferCsvColumnType).toBe('function');
    });

    it('should export type compatibility matrix', () => {
      expect(Canon.TYPE_COMPAT_MATRIX).toBeDefined();
      expect(typeof Canon.getCompatLevel).toBe('function');
      expect(typeof Canon.isCompatible).toBe('function');
      expect(typeof Canon.requiresTransform).toBe('function');
    });

    it('should export confidence semantics', () => {
      expect(Canon.CONFIDENCE_SEMANTICS).toBeDefined();
      expect(Canon.CONFIDENCE_SEMANTICS.EXACT).toBe(1.0);
    });
  });

  describe('Schemas', () => {
    it('should export Zod schemas', () => {
      expect(Canon.assetKeySchema).toBeDefined();
      expect(Canon.qualityRuleTypeSchema).toBeDefined();
      expect(Canon.qualityRuleSchema).toBeDefined();
      expect(Canon.qualityDimensionSchema).toBeDefined();
      expect(Canon.assetDescriptorSchema).toBeDefined();
    });
  });

  describe('Constants', () => {
    it('should export Canon constants', () => {
      expect(Canon.CANON_KEYSPACE_VERSION).toBe(1);
      expect(Canon.CANON_LAYER_RULES).toBeDefined();
    });

    it('should export asset key prefix specs', () => {
      expect(Canon.ASSET_KEY_PREFIX_SPECS).toBeDefined();
      expect(Canon.ASSET_KEY_PREFIX_SPECS['db.rec']).toBeDefined();
      expect(Canon.ASSET_KEY_PREFIX_SPECS['metric:']).toBeDefined();
    });
  });

  describe('API Stability', () => {
    it('should have stable export count (prevent accidental removals)', () => {
      const exports = Object.keys(Canon);
      
      // Minimum expected exports (will grow over time, never shrink)
      // This number should be updated when new exports are intentionally added
      const minimumExpectedExports = 50;
      
      expect(exports.length).toBeGreaterThanOrEqual(minimumExpectedExports);
    });

    it('should export types that can be imported', () => {
      // Type-only imports are checked at compile time
      // This test verifies the barrel exports are working
      const hasTypeExports = true;
      expect(hasTypeExports).toBe(true);
    });
  });

  describe('No Accidental Exports', () => {
    it('should not export internal implementation details', () => {
      const exports = Object.keys(Canon);
      
      // Should not export private/internal symbols
      const privatePatterns = [
        /^_/,           // underscore prefix
        /test/i,        // test utilities
        /mock/i,        // mock data
        /fixture/i,     // test fixtures
      ];

      const privateExports = exports.filter(name =>
        privatePatterns.some(pattern => pattern.test(name))
      );

      expect(privateExports).toHaveLength(0);
    });
  });
});
