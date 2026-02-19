/**
 * Common Field Schemas
 * 
 * Reusable field schemas for common patterns across entities.
 * Use these instead of defining fields inline for consistency.
 * 
 * @module schemas/fields
 */

import { z } from 'zod';

import { userIdSchema } from './branded';
import { primitives } from './helpers';

/**
 * Common field schemas for entity definitions
 * 
 * These schemas represent frequently used field patterns:
 * - Identifiers (id, slug)
 * - Timestamps (createdAt, updatedAt, deletedAt)
 * - Versioning (version)
 * - Soft delete (isDeleted)
 * - Audit fields (createdBy, updatedBy)
 * - Pagination (limit, offset, cursor)
 * 
 * @example
 * ```typescript
 * const userSchema = z.object({
 *   id: commonFields.id,
 *   slug: commonFields.slug,
 *   createdAt: commonFields.createdAt,
 *   updatedAt: commonFields.updatedAt,
 * });
 * ```
 */
export const commonFields = {
  // ── Identifiers ─────────────────────────────────────────
  
  /** UUID identifier */
  id: z.string().uuid().meta({
    id: 'CommonId',
    description: 'UUID identifier',
  }),

  /** URL-friendly slug (lowercase alphanumeric with hyphens) */
  slug: z.string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens')
    .meta({
      id: 'CommonSlug',
      description: 'URL-friendly slug',
    }),

  // ── Timestamps ──────────────────────────────────────────
  
  /** ISO 8601 creation timestamp */
  createdAt: primitives.timestamp.meta({
    id: 'CommonCreatedAt',
    description: 'ISO 8601 creation timestamp',
  }),

  /** ISO 8601 update timestamp */
  updatedAt: primitives.timestamp.meta({
    id: 'CommonUpdatedAt',
    description: 'ISO 8601 update timestamp',
  }),

  /** ISO 8601 deletion timestamp (nullable for soft delete) */
  deletedAt: primitives.timestamp.nullable().meta({
    id: 'CommonDeletedAt',
    description: 'ISO 8601 deletion timestamp (null if not deleted)',
  }),

  // ── Versioning ──────────────────────────────────────────
  
  /** Positive integer version for optimistic locking */
  version: z.number().int().positive().meta({
    id: 'CommonVersion',
    description: 'Version number for optimistic locking',
  }),

  // ── Soft Delete ─────────────────────────────────────────
  
  /** Boolean flag for soft delete status */
  isDeleted: z.boolean().default(false).meta({
    id: 'CommonIsDeleted',
    description: 'Soft delete flag',
  }),

  // ── Audit Fields ────────────────────────────────────────
  
  /** User ID who created the record */
  createdBy: userIdSchema.meta({
    id: 'CommonCreatedBy',
    description: 'User ID who created the record',
  }),

  /** User ID who last updated the record */
  updatedBy: userIdSchema.meta({
    id: 'CommonUpdatedBy',
    description: 'User ID who last updated the record',
  }),

  // ── Pagination ──────────────────────────────────────────
  
  /** Page size limit (1-100, default 20) */
  limit: z.coerce.number().int().min(1).max(100).default(20).meta({
    id: 'CommonLimit',
    description: 'Page size limit',
  }),

  /** Page offset (0+, default 0) */
  offset: z.coerce.number().int().min(0).default(0).meta({
    id: 'CommonOffset',
    description: 'Page offset',
  }),

  /** Cursor for cursor-based pagination */
  cursor: z.string().optional().meta({
    id: 'CommonCursor',
    description: 'Cursor for pagination',
  }),

  // ── Common Text Fields ──────────────────────────────────
  
  /** Short text (1-255 chars) */
  shortText: z.string().min(1).max(255).meta({
    id: 'CommonShortText',
    description: 'Short text field (1-255 characters)',
  }),

  /** Long text (1-10000 chars) */
  longText: z.string().min(1).max(10000).meta({
    id: 'CommonLongText',
    description: 'Long text field (1-10000 characters)',
  }),

  /** Optional description field */
  description: z.string().max(1000).optional().meta({
    id: 'CommonDescription',
    description: 'Optional description',
  }),

  // ── Common Numeric Fields ───────────────────────────────
  
  /** Non-negative integer */
  count: primitives.nonNegativeInt.meta({
    id: 'CommonCount',
    description: 'Non-negative count',
  }),

  /** Positive amount */
  amount: z.number().positive().meta({
    id: 'CommonAmount',
    description: 'Positive amount',
  }),

  // ── Common Status Fields ────────────────────────────────
  
  /** Active/inactive status */
  isActive: z.boolean().default(true).meta({
    id: 'CommonIsActive',
    description: 'Active status flag',
  }),

  /** Archived status */
  isArchived: z.boolean().default(false).meta({
    id: 'CommonIsArchived',
    description: 'Archived status flag',
  }),
} as const;
