/**
 * OpenAPI seed data export (data only, no generation)
 * 
 * Axis layer will use this to generate full OpenAPI spec.
 * 
 * @module schemas/catalog/openapi
 */

import type { OpenApiSeed } from './types';
import { CANON_SCHEMAS } from './index';

/**
 * OpenAPI seed for a single schema
 */
export interface OpenApiSchemaSeed {
  readonly id: string;
  readonly name: string;
  readonly seed: OpenApiSeed;
}

/**
 * Extract OpenAPI seeds from catalog (pure function)
 * 
 * @pure
 * @returns Array of OpenAPI seeds for schemas that have openapi metadata
 * 
 * @example
 * ```typescript
 * const seeds = extractOpenApiSeeds();
 * // Axis layer generates OpenAPI spec from seeds
 * const openApiSpec = generateOpenApiFromSeeds(seeds);
 * ```
 */
export function extractOpenApiSeeds(): readonly OpenApiSchemaSeed[] {
  return CANON_SCHEMAS.filter((item) => item.meta?.openapi).map((item) => ({
    id: item.id,
    name: item.name,
    seed: item.meta!.openapi!,
  }));
}

/**
 * Get OpenAPI seed for specific schema
 * 
 * @pure
 * @param id - Schema identifier
 * @returns OpenAPI seed or undefined if not found or no openapi metadata
 * 
 * @example
 * ```typescript
 * const seed = getOpenApiSeed('canon.branded.entityId');
 * if (seed) {
 *   console.log(seed.seed.title, seed.seed.description);
 * }
 * ```
 */
export function getOpenApiSeed(id: string): OpenApiSchemaSeed | undefined {
  const item = CANON_SCHEMAS.find((s) => s.id === id);
  if (!item?.meta?.openapi) return undefined;

  return {
    id: item.id,
    name: item.name,
    seed: item.meta.openapi,
  };
}
