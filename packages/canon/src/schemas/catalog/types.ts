/**
 * Schema catalog types - compile-time SSOT
 * 
 * No runtime registration, no mutable state.
 * Catalog is frozen at build time.
 * 
 * @module schemas/catalog/types
 */

/**
 * Schema identifier format: canon.{category}.{name}
 * 
 * @example "canon.branded.entityId"
 * @example "canon.field.email"
 */
export type SchemaId = string;

/**
 * Schema categories for organization
 */
export type SchemaCategory =
  | 'branded'    // Branded ID types (EntityId, OrgId, etc.)
  | 'field'      // Common field schemas (email, slug, etc.)
  | 'entity'     // Entity schemas (EntityRef, etc.)
  | 'validation' // Validation schemas (error codes, etc.)
  | 'api'        // API envelope schemas (ApiResponse, etc.)
  | 'internal';  // Internal utility schemas

/**
 * Schema tags for discovery and filtering
 */
export type SchemaTag =
  | 'core'
  | 'identifier'
  | 'timestamp'
  | 'audit'
  | 'pagination'
  | 'metadata'
  | 'deprecated';

/**
 * OpenAPI-compatible metadata (data only, no generation logic)
 */
export interface OpenApiSeed {
  readonly title?: string;
  readonly description?: string;
  readonly examples?: readonly unknown[];
  readonly externalDocs?: {
    readonly url: string;
    readonly description?: string;
  };
}

/**
 * Schema metadata (frozen at build time)
 */
export interface SchemaMeta {
  readonly title?: string;
  readonly description?: string;
  readonly examples?: readonly unknown[];
  readonly deprecated?: boolean;
  readonly replacedBy?: SchemaId;
  readonly openapi?: OpenApiSeed;
}

/**
 * Catalog item (frozen)
 * 
 * Represents a single schema in the Canon catalog.
 * All fields are readonly to prevent mutations.
 */
export interface CanonSchemaItem<T = unknown> {
  readonly id: SchemaId;
  readonly category: SchemaCategory;
  readonly name: string;
  readonly version: number; // Integer bump on breaking changes
  readonly tags: readonly SchemaTag[];
  readonly schema: import('zod').ZodType<T>;
  readonly meta?: SchemaMeta;
}

/**
 * Catalog filters for discovery
 */
export interface SchemaFilters {
  readonly category?: SchemaCategory;
  readonly tags?: readonly SchemaTag[];
  readonly deprecated?: boolean;
  readonly namePattern?: string;
}
