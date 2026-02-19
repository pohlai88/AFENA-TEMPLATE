/**
 * Pure discovery functions - no side effects
 * 
 * All functions are deterministic and stateless.
 * 
 * @module schemas/catalog/discovery
 */

import type { CanonSchemaItem, SchemaCategory, SchemaFilters, SchemaId } from './types';
import { CANON_SCHEMAS, CANON_SCHEMA_BY_CATEGORY, CANON_SCHEMA_MAP } from './index';

/**
 * Get schema by ID (O(1) lookup)
 * 
 * @pure
 * @param id - Schema identifier
 * @returns Schema item or undefined if not found
 * 
 * @example
 * ```typescript
 * const schema = getSchema('canon.branded.entityId');
 * if (schema) {
 *   const result = schema.schema.parse(uuid);
 * }
 * ```
 */
export function getSchema(id: SchemaId): CanonSchemaItem | undefined {
  return CANON_SCHEMA_MAP.get(id);
}

/**
 * Check if schema exists (O(1) lookup)
 * 
 * @pure
 * @param id - Schema identifier
 * @returns True if schema exists
 * 
 * @example
 * ```typescript
 * if (hasSchema('canon.branded.entityId')) {
 *   // Schema exists
 * }
 * ```
 */
export function hasSchema(id: SchemaId): boolean {
  return CANON_SCHEMA_MAP.has(id);
}

/**
 * List all schemas (returns frozen array)
 * 
 * @pure
 * @returns All schemas in catalog
 * 
 * @example
 * ```typescript
 * const all = listSchemas();
 * console.log(`Total schemas: ${all.length}`);
 * ```
 */
export function listSchemas(): readonly CanonSchemaItem[] {
  return CANON_SCHEMAS;
}

/**
 * Find schemas by filters (pure function, O(n) search)
 * 
 * @pure
 * @param filters - Filter criteria
 * @returns Filtered schemas
 * 
 * @example
 * ```typescript
 * // Find all branded schemas
 * const branded = findSchemas({ category: 'branded' });
 * 
 * // Find all identifier schemas
 * const identifiers = findSchemas({ tags: ['identifier'] });
 * 
 * // Find non-deprecated schemas
 * const active = findSchemas({ deprecated: false });
 * 
 * // Find schemas by name pattern
 * const emailSchemas = findSchemas({ namePattern: 'email' });
 * ```
 */
export function findSchemas(filters: SchemaFilters): readonly CanonSchemaItem[] {
  let results = CANON_SCHEMAS;

  // Filter by category (use pre-computed index if possible)
  if (filters.category) {
    results = CANON_SCHEMA_BY_CATEGORY[filters.category];
  }

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter((schema) =>
      filters.tags!.some((tag) => schema.tags.includes(tag))
    );
  }

  // Filter by deprecated
  if (filters.deprecated !== undefined) {
    results = results.filter((schema) =>
      filters.deprecated ? schema.meta?.deprecated === true : !schema.meta?.deprecated
    );
  }

  // Filter by name pattern (simple includes, not regex)
  if (filters.namePattern) {
    const pattern = filters.namePattern.toLowerCase();
    results = results.filter(
      (schema) =>
        schema.name.toLowerCase().includes(pattern) ||
        schema.meta?.title?.toLowerCase().includes(pattern)
    );
  }

  return results;
}

/**
 * Get schemas by category (O(1) via pre-computed index)
 * 
 * @pure
 * @param category - Schema category
 * @returns Schemas in category
 * 
 * @example
 * ```typescript
 * const branded = getSchemasByCategory('branded');
 * const fields = getSchemasByCategory('field');
 * ```
 */
export function getSchemasByCategory(category: SchemaCategory): readonly CanonSchemaItem[] {
  return CANON_SCHEMA_BY_CATEGORY[category];
}

/**
 * Get schema metadata only (no schema object)
 * 
 * @pure
 * @param id - Schema identifier
 * @returns Schema metadata or undefined
 * 
 * @example
 * ```typescript
 * const meta = getSchemaMeta('canon.branded.entityId');
 * if (meta) {
 *   console.log(meta.title, meta.version);
 * }
 * ```
 */
export function getSchemaMeta(id: SchemaId) {
  const item = CANON_SCHEMA_MAP.get(id);
  if (!item) return undefined;

  return {
    id: item.id,
    category: item.category,
    name: item.name,
    version: item.version,
    tags: item.tags,
    meta: item.meta,
  } as const;
}
