/**
 * Canon v1 Constants & Configuration
 *
 * This module defines canonical constants that govern the Canon package behavior.
 * All constants are immutable and version-locked per Principle P3 (Additive-only evolution).
 */

/**
 * Canon Keyspace Version
 *
 * Tracks the grammar version of asset keys.
 * v1 defines the grammar in §7.1 of canon.architecture.md
 * Future versions may introduce new prefixes or segment rules; v1 keys remain valid.
 */
export const CANON_KEYSPACE_VERSION = 1 as const;

/**
 * Canon Layer Rules - Dependency Enforcement
 *
 * Specifies which modules may import which directories.
 * Used by:
 * - CI tests to validate the import graph (dependency-cruiser)
 * - Documentation and architecture discussions
 *
 * Direction: lower indices may import higher indices, not reverse.
 * Always: validators can import everything else; index.ts imports validators.
 */
export const CANON_LAYER_RULES = {
  enums: { mayImport: [] as const },
  types: { mayImport: ['enums'] as const },
  schemas: { mayImport: ['enums', 'types'] as const },
  'lite-meta': { mayImport: ['enums', 'types', 'schemas'] as const },
  mappings: { mayImport: ['enums', 'types', 'schemas', 'lite-meta'] as const },
  registries: { mayImport: ['enums', 'types', 'schemas', 'lite-meta'] as const },
  validators: {
    mayImport: [
      'enums',
      'types',
      'schemas',
      'lite-meta',
      'mappings',
      'registries',
    ] as const,
  },
} as const satisfies Record<string, { mayImport: readonly string[] }>;

/**
 * Layer keys for indexing
 */
export type CanonLayerKey = keyof typeof CANON_LAYER_RULES;
