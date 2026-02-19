/**
 * Schema Catalog Invariant Tests
 * 
 * Tests for catalog integrity and discovery API correctness.
 */

import { describe, expect, it } from 'vitest';

import {
  CANON_SCHEMAS,
  CANON_SCHEMA_BY_CATEGORY,
  CANON_SCHEMA_MAP,
} from '../index';
import {
  findSchemas,
  getSchema,
  getSchemasByCategory,
  getSchemaMeta,
  hasSchema,
  listSchemas,
} from '../discovery';
import { extractOpenApiSeeds, getOpenApiSeed } from '../openapi';

describe('Schema Catalog Invariants', () => {
  describe('SCH-CAT-01: ID uniqueness', () => {
    it('should have unique IDs', () => {
      const ids = CANON_SCHEMAS.map((s) => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have no empty IDs', () => {
      for (const schema of CANON_SCHEMAS) {
        expect(schema.id).toBeTruthy();
        expect(schema.id.length).toBeGreaterThan(0);
      }
    });
  });

  describe('SCH-CAT-02: ID format', () => {
    it('should follow canon.{category}.{name} format', () => {
      for (const schema of CANON_SCHEMAS) {
        expect(schema.id).toMatch(/^canon\.[a-z]+\.[a-zA-Z]+$/);
      }
    });

    it('should have ID matching category and name', () => {
      for (const schema of CANON_SCHEMAS) {
        expect(schema.id).toBe(`canon.${schema.category}.${schema.name}`);
      }
    });
  });

  describe('SCH-CAT-03: Map consistency', () => {
    it('should have map matching array exactly', () => {
      expect(CANON_SCHEMA_MAP.size).toBe(CANON_SCHEMAS.length);

      for (const schema of CANON_SCHEMAS) {
        expect(CANON_SCHEMA_MAP.get(schema.id)).toBe(schema);
      }
    });

    it('should have no extra entries in map', () => {
      const mapIds = Array.from(CANON_SCHEMA_MAP.keys());
      const arrayIds = CANON_SCHEMAS.map((s) => s.id);
      expect(mapIds.sort()).toEqual(arrayIds.sort());
    });
  });

  describe('SCH-CAT-04: Version validity', () => {
    it('should have version >= 1', () => {
      for (const schema of CANON_SCHEMAS) {
        expect(schema.version).toBeGreaterThanOrEqual(1);
      }
    });

    it('should have integer versions', () => {
      for (const schema of CANON_SCHEMAS) {
        expect(Number.isInteger(schema.version)).toBe(true);
      }
    });
  });

  describe('SCH-CAT-05: Determinism', () => {
    it('should produce stable JSON', () => {
      const json1 = JSON.stringify(CANON_SCHEMAS);
      const json2 = JSON.stringify(CANON_SCHEMAS);
      expect(json1).toBe(json2);
    });

    it('should have consistent ordering', () => {
      const ids1 = CANON_SCHEMAS.map((s) => s.id);
      const ids2 = listSchemas().map((s) => s.id);
      expect(ids1).toEqual(ids2);
    });
  });

  describe('SCH-CAT-06: Deprecation chain', () => {
    it('should have replacedBy pointing to existing schema', () => {
      for (const schema of CANON_SCHEMAS) {
        if (schema.meta?.replacedBy) {
          expect(hasSchema(schema.meta.replacedBy)).toBe(true);
        }
      }
    });

    it('should not have circular deprecation', () => {
      const visited = new Set<string>();
      for (const schema of CANON_SCHEMAS) {
        if (schema.meta?.replacedBy) {
          visited.clear();
          let current = schema.id;
          while (current) {
            if (visited.has(current)) {
              throw new Error(`Circular deprecation detected: ${current}`);
            }
            visited.add(current);
            const next = getSchema(current)?.meta?.replacedBy;
            if (!next) break;
            current = next;
          }
        }
      }
    });
  });

  describe('SCH-CAT-07: Category index', () => {
    it('should have all categories in index', () => {
      const categories = ['branded', 'field', 'entity', 'validation', 'api', 'internal'] as const;
      for (const category of categories) {
        expect(CANON_SCHEMA_BY_CATEGORY[category]).toBeDefined();
      }
    });

    it('should have category index matching filter', () => {
      for (const category of Object.keys(CANON_SCHEMA_BY_CATEGORY)) {
        const indexed = CANON_SCHEMA_BY_CATEGORY[category as keyof typeof CANON_SCHEMA_BY_CATEGORY];
        const filtered = CANON_SCHEMAS.filter((s) => s.category === category);
        expect(indexed.length).toBe(filtered.length);
      }
    });
  });
});

describe('Discovery API', () => {
  describe('getSchema', () => {
    it('should return correct schema', () => {
      const schema = getSchema('canon.branded.entityId');
      expect(schema).toBeDefined();
      expect(schema?.name).toBe('entityId');
      expect(schema?.category).toBe('branded');
    });

    it('should return undefined for non-existent schema', () => {
      const schema = getSchema('canon.nonexistent.schema');
      expect(schema).toBeUndefined();
    });
  });

  describe('hasSchema', () => {
    it('should return true for existing schema', () => {
      expect(hasSchema('canon.branded.entityId')).toBe(true);
    });

    it('should return false for non-existent schema', () => {
      expect(hasSchema('canon.nonexistent.schema')).toBe(false);
    });
  });

  describe('listSchemas', () => {
    it('should return all schemas', () => {
      const all = listSchemas();
      expect(all.length).toBe(CANON_SCHEMAS.length);
    });

    it('should return frozen array', () => {
      const all = listSchemas();
      expect(Object.isFrozen(all)).toBe(true);
    });
  });

  describe('findSchemas', () => {
    it('should filter by category', () => {
      const branded = findSchemas({ category: 'branded' });
      expect(branded.length).toBeGreaterThan(0);
      expect(branded.every((s) => s.category === 'branded')).toBe(true);
    });

    it('should filter by tags', () => {
      const identifiers = findSchemas({ tags: ['identifier'] });
      expect(identifiers.length).toBeGreaterThan(0);
      expect(identifiers.every((s) => s.tags.includes('identifier'))).toBe(true);
    });

    it('should filter by deprecated', () => {
      const active = findSchemas({ deprecated: false });
      expect(active.every((s) => !s.meta?.deprecated)).toBe(true);
    });

    it('should filter by name pattern', () => {
      const idSchemas = findSchemas({ namePattern: 'id' });
      expect(idSchemas.length).toBeGreaterThan(0);
      expect(
        idSchemas.every(
          (s) =>
            s.name.toLowerCase().includes('id') ||
            s.meta?.title?.toLowerCase().includes('id')
        )
      ).toBe(true);
    });

    it('should combine multiple filters', () => {
      const results = findSchemas({
        category: 'branded',
        tags: ['identifier'],
      });
      expect(results.every((s) => s.category === 'branded')).toBe(true);
      expect(results.every((s) => s.tags.includes('identifier'))).toBe(true);
    });
  });

  describe('getSchemasByCategory', () => {
    it('should return schemas for category', () => {
      const branded = getSchemasByCategory('branded');
      expect(branded.length).toBeGreaterThan(0);
      expect(branded.every((s) => s.category === 'branded')).toBe(true);
    });

    it('should match pre-computed index', () => {
      const branded = getSchemasByCategory('branded');
      expect(branded).toBe(CANON_SCHEMA_BY_CATEGORY.branded);
    });
  });

  describe('getSchemaMeta', () => {
    it('should return metadata for existing schema', () => {
      const meta = getSchemaMeta('canon.branded.entityId');
      expect(meta).toBeDefined();
      expect(meta?.name).toBe('entityId');
      expect(meta?.category).toBe('branded');
    });

    it('should return undefined for non-existent schema', () => {
      const meta = getSchemaMeta('canon.nonexistent.schema');
      expect(meta).toBeUndefined();
    });

    it('should not include schema object', () => {
      const meta = getSchemaMeta('canon.branded.entityId');
      expect(meta).toBeDefined();
      expect('schema' in meta!).toBe(false);
    });
  });
});

describe('OpenAPI Seed Export', () => {
  describe('extractOpenApiSeeds', () => {
    it('should return only schemas with openapi metadata', () => {
      const seeds = extractOpenApiSeeds();
      expect(seeds.length).toBeGreaterThan(0);
      for (const seed of seeds) {
        const schema = getSchema(seed.id);
        expect(schema?.meta?.openapi).toBeDefined();
      }
    });

    it('should include all required fields', () => {
      const seeds = extractOpenApiSeeds();
      for (const seed of seeds) {
        expect(seed.id).toBeTruthy();
        expect(seed.name).toBeTruthy();
        expect(seed.seed).toBeDefined();
      }
    });
  });

  describe('getOpenApiSeed', () => {
    it('should return seed for schema with openapi metadata', () => {
      const seed = getOpenApiSeed('canon.branded.entityId');
      expect(seed).toBeDefined();
      expect(seed?.seed).toBeDefined();
    });

    it('should return undefined for schema without openapi metadata', () => {
      // Find a schema without openapi metadata
      const schemaWithoutOpenApi = CANON_SCHEMAS.find((s) => !s.meta?.openapi);
      if (schemaWithoutOpenApi) {
        const seed = getOpenApiSeed(schemaWithoutOpenApi.id);
        expect(seed).toBeUndefined();
      }
    });

    it('should return undefined for non-existent schema', () => {
      const seed = getOpenApiSeed('canon.nonexistent.schema');
      expect(seed).toBeUndefined();
    });
  });
});
