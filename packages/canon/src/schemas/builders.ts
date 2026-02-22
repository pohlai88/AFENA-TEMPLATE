/**
 * Schema Builder Pattern
 * 
 * Provides fluent API for building complex schemas with common patterns.
 * Use builders to compose schemas with timestamps, audit fields, soft delete, etc.
 * 
 * @module schemas/builders
 */

import { z } from 'zod';

import { commonFields } from './fields';

/**
 * Schema builder with fluent API
 * 
 * Provides chainable methods to add common field patterns to schemas.
 * Reduces boilerplate and ensures consistency across entity definitions.
 * 
 * @example
 * ```typescript
 * const userSchema = new SchemaBuilder({
 *   name: z.string(),
 *   email: primitives.email,
 * })
 *   .withTimestamps()
 *   .withAudit()
 *   .withSoftDelete()
 *   .build();
 * ```
 */
export class SchemaBuilder<T extends z.ZodRawShape> {
  constructor(private shape: T) {}

  /**
   * Add timestamp fields (createdAt, updatedAt)
   * 
   * @returns New builder with timestamp fields
   */
  withTimestamps() {
    return new SchemaBuilder({
      ...this.shape,
      createdAt: commonFields.createdAt,
      updatedAt: commonFields.updatedAt,
    });
  }

  /**
   * Add soft delete fields (deletedAt, isDeleted)
   * 
   * @returns New builder with soft delete fields
   */
  withSoftDelete() {
    return new SchemaBuilder({
      ...this.shape,
      deletedAt: commonFields.deletedAt,
      isDeleted: commonFields.isDeleted,
    });
  }

  /**
   * Add audit fields (createdBy, updatedBy)
   * 
   * @returns New builder with audit fields
   */
  withAudit() {
    return new SchemaBuilder({
      ...this.shape,
      createdBy: commonFields.createdBy,
      updatedBy: commonFields.updatedBy,
    });
  }

  /**
   * Add version field for optimistic locking
   * 
   * @returns New builder with version field
   */
  withVersion() {
    return new SchemaBuilder({
      ...this.shape,
      version: commonFields.version,
    });
  }

  /**
   * Add ID field (UUID)
   * 
   * @returns New builder with id field
   */
  withId() {
    return new SchemaBuilder({
      ...this.shape,
      id: commonFields.id,
    });
  }

  /**
   * Add slug field (URL-friendly identifier)
   * 
   * @returns New builder with slug field
   */
  withSlug() {
    return new SchemaBuilder({
      ...this.shape,
      slug: commonFields.slug,
    });
  }

  /**
   * Add status fields (isActive, isArchived)
   * 
   * @returns New builder with status fields
   */
  withStatus() {
    return new SchemaBuilder({
      ...this.shape,
      isActive: commonFields.isActive,
      isArchived: commonFields.isArchived,
    });
  }

  /**
   * Add description field
   * 
   * @returns New builder with description field
   */
  withDescription() {
    return new SchemaBuilder({
      ...this.shape,
      description: commonFields.description,
    });
  }

  /**
   * Add all standard entity fields
   * 
   * Includes: id, timestamps, audit, version, soft delete
   * 
   * @returns New builder with all standard fields
   */
  withStandardFields() {
    return new SchemaBuilder({
      ...this.shape,
      id: commonFields.id,
      createdAt: commonFields.createdAt,
      updatedAt: commonFields.updatedAt,
      createdBy: commonFields.createdBy,
      updatedBy: commonFields.updatedBy,
      version: commonFields.version,
      deletedAt: commonFields.deletedAt,
      isDeleted: commonFields.isDeleted,
    });
  }

  /**
   * Build the final Zod object schema
   * 
   * @returns Zod object schema with all accumulated fields
   */
  build() {
    return z.object(this.shape);
  }

  /**
   * Build with metadata
   * 
   * @param meta - Metadata for the schema
   * @returns Zod object schema with metadata
   */
  buildWithMeta(meta: { id: string; description: string; examples?: unknown[] }) {
    return z.object(this.shape).meta(meta);
  }
}

/**
 * Create a new schema builder
 * 
 * Convenience function to start building a schema.
 * 
 * @param shape - Initial shape of the schema
 * @returns New SchemaBuilder instance
 * 
 * @example
 * ```typescript
 * const productSchema = createSchemaBuilder({
 *   name: z.string(),
 *   price: z.number().positive(),
 *   sku: z.string(),
 * })
 *   .withId()
 *   .withTimestamps()
 *   .withStatus()
 *   .build();
 * ```
 */
export function createSchemaBuilder<T extends z.ZodRawShape>(shape: T) {
  return new SchemaBuilder(shape);
}
