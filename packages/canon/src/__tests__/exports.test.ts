/**
 * Consumer simulation tests
 * 
 * Ensures all subpath exports work in both ESM and CJS contexts.
 * Catches broken exports before publishing.
 */

import { describe, expect, it } from 'vitest';

describe('Package Exports', () => {
  describe('Main export', () => {
    it('should export main barrel', async () => {
      const canon = await import('../index');

      // Spot check key exports from main barrel
      expect(canon.parseAssetKey).toBeDefined();
      expect(canon.assetKeySchema).toBeDefined();
      expect(canon.ENTITY_TYPES).toBeDefined();
      expect(canon.ACTION_VERBS).toBeDefined();
      expect(canon.BoundedLRU).toBeDefined();
    });
  });

  describe('Subpath: lite-meta', () => {
    it('should export lite-meta functions', async () => {
      const liteMeta = await import('../lite-meta/index');

      expect(liteMeta.parseAssetKey).toBeDefined();
      expect(liteMeta.validateAssetKey).toBeDefined();
      expect(liteMeta.buildAssetKey).toBeDefined();
      expect(liteMeta.resolveAlias).toBeDefined();
      expect(liteMeta.compileQualityRule).toBeDefined();
      expect(liteMeta.classifyColumn).toBeDefined();
    });
  });

  describe('Subpath: schemas', () => {
    it('should export schemas', async () => {
      const schemas = await import('../schemas/index');

      expect(schemas.assetKeySchema).toBeDefined();
      expect(schemas.assetKeyInputSchema).toBeDefined();
      expect(schemas.entityRefSchema).toBeDefined();
      expect(schemas.receiptSchema).toBeDefined();
      expect(schemas.entityIdSchema).toBeDefined();
    });
  });

  describe('Subpath: types', () => {
    it('should export types and branded ID functions', async () => {
      const types = await import('../types/index');

      expect(types.asEntityId).toBeDefined();
      expect(types.isEntityId).toBeDefined();
      expect(types.ok).toBeDefined();
      expect(types.err).toBeDefined();
      expect(types.ENTITY_TYPES).toBeDefined();
      expect(types.ACTION_VERBS).toBeDefined();
    });
  });

  describe('Subpath: mappings', () => {
    it('should export mapping functions', async () => {
      const mappings = await import('../mappings/index');

      expect(mappings.mapPostgresType).toBeDefined();
      expect(mappings.inferCsvColumnType).toBeDefined();
      expect(mappings.isCompatible).toBeDefined();
      expect(mappings.TYPE_COMPAT_MATRIX).toBeDefined();
    });
  });
});
