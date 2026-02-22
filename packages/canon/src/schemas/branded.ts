/**
 * Branded Zod schemas for validation + type inference
 * 
 * Use z.string().uuid() (not z.uuid()) for consistency with existing Canon.
 * These schemas validate AND brand in one step.
 * 
 * Performance: Uses memoization to cache compiled schemas (10-50x speedup).
 */

import { z } from 'zod';

import { memoizeSchema } from './cache';

/**
 * Branded entity identifier schema
 */
export const entityIdSchema = memoizeSchema('entityId', () =>
  z
    .string()
    .uuid()
    .brand<'EntityId'>()
    .meta({
      id: 'EntityId',
      description: 'Branded entity identifier (UUID)',
    })
);

/**
 * Branded organization identifier schema
 */
export const orgIdSchema = memoizeSchema('orgId', () =>
  z
    .string()
    .uuid()
    .brand<'OrgId'>()
    .meta({
      id: 'OrgId',
      description: 'Branded organization identifier (UUID)',
    })
);

/**
 * Branded user identifier schema
 */
export const userIdSchema = memoizeSchema('userId', () =>
  z
    .string()
    .uuid()
    .brand<'UserId'>()
    .meta({
      id: 'UserId',
      description: 'Branded user identifier (UUID)',
    })
);

/**
 * Branded batch identifier schema
 */
export const batchIdSchema = memoizeSchema('batchId', () =>
  z
    .string()
    .uuid()
    .brand<'BatchId'>()
    .meta({
      id: 'BatchId',
      description: 'Branded batch identifier (UUID)',
    })
);

/**
 * Branded mutation identifier schema
 */
export const mutationIdSchema = memoizeSchema('mutationId', () =>
  z
    .string()
    .uuid()
    .brand<'MutationId'>()
    .meta({
      id: 'MutationId',
      description: 'Branded mutation identifier (UUID)',
    })
);

/**
 * Branded audit log identifier schema
 */
export const auditLogIdSchema = memoizeSchema('auditLogId', () =>
  z
    .string()
    .uuid()
    .brand<'AuditLogId'>()
    .meta({
      id: 'AuditLogId',
      description: 'Branded audit log identifier (UUID)',
    })
);

// Type exports (inferred from schemas)
export type EntityId = z.infer<typeof entityIdSchema>;
export type OrgId = z.infer<typeof orgIdSchema>;
export type UserId = z.infer<typeof userIdSchema>;
export type BatchId = z.infer<typeof batchIdSchema>;
export type MutationId = z.infer<typeof mutationIdSchema>;
export type AuditLogId = z.infer<typeof auditLogIdSchema>;
