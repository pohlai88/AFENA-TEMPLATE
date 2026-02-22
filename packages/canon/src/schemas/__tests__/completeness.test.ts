import { describe, expect, it } from 'vitest';
import { DATA_TYPES } from '../../enums/data-types';
import { META_ASSET_TYPES } from '../../enums/meta-asset-type';
import { ASSET_TYPE_PREFIXES } from '../../lite-meta/types/asset-type-prefixes';
import { TYPE_CONFIG_SCHEMAS, getTypeConfigSchema } from '../data-types';

describe('Schema Completeness Gates', () => {
  describe('TYPE_CONFIG_SCHEMAS Exhaustiveness', () => {
    it('should have a schema for every DataType', () => {
      const schemaKeys = Object.keys(TYPE_CONFIG_SCHEMAS).sort();
      const dataTypes = [...DATA_TYPES].sort();

      expect(schemaKeys).toEqual(dataTypes);
    });

    it('should not have extra schemas beyond DataType', () => {
      const schemaKeys = Object.keys(TYPE_CONFIG_SCHEMAS);
      const dataTypes = [...DATA_TYPES];

      // Every schema key must be a valid DataType
      for (const key of schemaKeys) {
        expect(dataTypes).toContain(key);
      }
    });

    it('should have no missing schemas', () => {
      const schemaKeys = Object.keys(TYPE_CONFIG_SCHEMAS);
      const missing = DATA_TYPES.filter(dt => !schemaKeys.includes(dt));

      expect(missing).toEqual([]);
    });

    it('should be accessible via getTypeConfigSchema', () => {
      // Every DataType should have an accessible schema
      for (const dataType of DATA_TYPES) {
        const schema = getTypeConfigSchema(dataType);
        expect(schema).toBeDefined();
        expect(typeof schema.safeParse).toBe('function');
      }
    });
  });

  describe('ASSET_TYPE_PREFIXES Exhaustiveness', () => {
    it('should have prefixes for every MetaAssetType', () => {
      const prefixKeys = Object.keys(ASSET_TYPE_PREFIXES).sort();
      const assetTypes = [...META_ASSET_TYPES].sort();

      expect(prefixKeys).toEqual(assetTypes);
    });

    it('should not have extra prefix mappings', () => {
      const prefixKeys = Object.keys(ASSET_TYPE_PREFIXES);
      const assetTypes = [...META_ASSET_TYPES];

      for (const key of prefixKeys) {
        expect(assetTypes).toContain(key);
      }
    });

    it('should have no missing prefix mappings', () => {
      const prefixKeys = Object.keys(ASSET_TYPE_PREFIXES);
      const missing = META_ASSET_TYPES.filter(at => !prefixKeys.includes(at));

      expect(missing).toEqual([]);
    });

    it('should have at least one prefix per type', () => {
      for (const [_type, prefixes] of Object.entries(ASSET_TYPE_PREFIXES)) {
        expect(prefixes.length).toBeGreaterThan(0);
        expect(Array.isArray(prefixes)).toBe(true);
      }
    });

    it('should have no duplicate prefixes across types', () => {
      const allPrefixes = Object.values(ASSET_TYPE_PREFIXES).flat();
      const uniquePrefixes = new Set(allPrefixes);

      expect(allPrefixes.length).toBe(uniquePrefixes.size);
    });

    it('should have non-empty prefix strings', () => {
      for (const prefixes of Object.values(ASSET_TYPE_PREFIXES)) {
        for (const prefix of prefixes) {
          expect(typeof prefix).toBe('string');
          expect(prefix.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Runtime Validation (Dev Mode)', () => {
    it('should validate TYPE_CONFIG_SCHEMAS at module load in dev', () => {
      // This test verifies that the runtime check in data-types.ts
      // executes without throwing. If TYPE_CONFIG_SCHEMAS were incomplete,
      // the module would fail to load in dev mode.

      // The fact that we can import and use TYPE_CONFIG_SCHEMAS
      // proves the runtime validation passed
      expect(Object.keys(TYPE_CONFIG_SCHEMAS).length).toBeGreaterThan(0);
    });

    it('should validate ASSET_TYPE_PREFIXES at module load in dev', () => {
      // Similar to above - if ASSET_TYPE_PREFIXES had duplicate prefixes,
      // the module would fail to load in dev mode

      expect(Object.keys(ASSET_TYPE_PREFIXES).length).toBeGreaterThan(0);
    });
  });
});
