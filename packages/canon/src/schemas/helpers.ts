/**
 * Schema composition helpers
 * 
 * Keeps metadata local to schema definitions (no import-side registry).
 * Provides reusable building blocks for common validation patterns.
 */

import { z } from 'zod';

/**
 * Add metadata to a Zod schema for JSON Schema generation
 * 
 * Attaches id, description, and optional examples to any Zod schema.
 * Metadata is used when generating JSON Schema or OpenAPI specs.
 * 
 * @param schema - Any Zod schema
 * @param meta - Metadata object with id, description, and optional fields
 * @returns Schema with metadata attached
 * 
 * @example
 * ```typescript
 * const userSchema = withMeta(
 *   z.object({ name: z.string(), age: z.number() }),
 *   {
 *     id: 'User',
 *     description: 'User profile information',
 *     examples: [{ name: 'Alice', age: 30 }]
 *   }
 * );
 * ```
 */
export function withMeta<T extends z.ZodTypeAny>(
  schema: T,
  meta: { id: string; description: string; examples?: unknown[]; deprecated?: boolean; tags?: string[] }
): T {
  return schema.meta(meta);
}

/**
 * Common validated primitives (reusable building blocks)
 * 
 * Use these instead of raw z.string(), z.number(), etc. for consistency.
 */
export const primitives = {
  /**
   * Valid email address
   */
  email: z.string().email().meta({
    id: 'Email',
    description: 'Valid email address',
  }),

  /**
   * Valid URL
   */
  url: z.string().url().meta({
    id: 'URL',
    description: 'Valid URL',
  }),

  /**
   * ISO 8601 datetime string
   */
  timestamp: z.string().datetime().meta({
    id: 'Timestamp',
    description: 'ISO 8601 datetime string',
  }),

  /**
   * ISO date (YYYY-MM-DD)
   */
  isoDate: z.iso.date().meta({
    id: 'ISODate',
    description: 'ISO date (YYYY-MM-DD)',
  }),

  /**
   * Positive integer (> 0)
   */
  positiveInt: z.coerce.number().int().positive().meta({
    id: 'PositiveInteger',
    description: 'Positive integer (> 0)',
  }),

  /**
   * Non-negative integer (>= 0)
   */
  nonNegativeInt: z.coerce.number().int().min(0).meta({
    id: 'NonNegativeInteger',
    description: 'Non-negative integer (>= 0)',
  }),

  /**
   * Percentage value (0-100)
   */
  percentage: z.coerce.number().min(0).max(100).meta({
    id: 'Percentage',
    description: 'Percentage value (0-100)',
  }),
} as const;

/**
 * Helper to create enum schema with metadata
 * 
 * @param values - Enum values
 * @param meta - Metadata object
 * @returns Enum schema with metadata
 */
export function createEnumSchema<T extends readonly [string, ...string[]]>(
  values: T,
  meta: { id: string; description: string; examples?: unknown[] }
) {
  return z.enum(values).meta(meta);
}
