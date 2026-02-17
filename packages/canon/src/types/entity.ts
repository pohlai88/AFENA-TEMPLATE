/**
 * Entity type registry — extensible as new domain entities are added.
 * Each entity type maps to a database table and a set of namespaced actions.
 */
export const ENTITY_TYPES = [
  'contacts',
  'companies',
  // @entity-gen:entity-types
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

/**
 * Reference to a specific entity instance.
 * K-09: `id` is optional on create — kernel generates UUID.
 */
export interface EntityRef {
  type: EntityType;
  id?: string;
}

/**
 * Base fields present on every domain entity row.
 * Mirrors the `baseEntityColumns()` Drizzle helper output.
 */
export interface BaseEntity {
  id: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
}
