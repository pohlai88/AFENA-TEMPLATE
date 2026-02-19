import { z } from 'zod';

import { auditLogIdSchema, batchIdSchema, entityIdSchema, mutationIdSchema } from './branded';
import { errorCodeSchema } from './errors';

export const receiptStatusSchema = z.enum(['ok', 'rejected', 'error']);

/** Flat receipt schema — preserved for backwards compatibility and API validation. */
export const receiptSchema = z.object({
  requestId: z.string(),
  mutationId: mutationIdSchema,
  batchId: batchIdSchema.optional(),
  entityId: entityIdSchema.nullable(),
  entityType: z.string(),
  versionBefore: z.number().int().nullable(),
  versionAfter: z.number().int().nullable(),
  status: receiptStatusSchema,
  auditLogId: auditLogIdSchema.nullable(),
  errorCode: errorCodeSchema.optional(),
}).meta({
  id: 'Receipt',
  description: 'Mutation operation receipt with branded IDs',
});

/** Zod literal for RetryableReason. */
export const retryableReasonSchema = z.enum(['rate_limited', 'db_timeout', 'transient_error']);

/**
 * Discriminated-union receipt schema.
 *
 * Narrows shape based on `status` — use this for parsing mutation responses
 * when you want type-safe access to variant-specific fields.
 */
export const mutationReceiptSchema = z.discriminatedUnion('status', [
  // ok
  z.object({
    status: z.literal('ok'),
    requestId: z.string(),
    mutationId: mutationIdSchema,
    batchId: batchIdSchema.optional(),
    entityId: z.string(),         // non-null on success
    entityType: z.string(),
    versionBefore: z.number().int().nullable(),
    versionAfter: z.number().int(), // always defined on success
    auditLogId: auditLogIdSchema.nullable(),
  }),
  // rejected
  z.object({
    status: z.literal('rejected'),
    requestId: z.string(),
    mutationId: mutationIdSchema,
    batchId: batchIdSchema.optional(),
    entityId: z.string().nullable(),
    entityType: z.string(),
    versionBefore: z.null(),
    versionAfter: z.null(),
    auditLogId: z.null(),
    errorId: z.string(),
    errorCode: errorCodeSchema,
    isClientFault: z.literal(true),
    retryable: z.literal(false),
  }),
  // error
  z.object({
    status: z.literal('error'),
    requestId: z.string(),
    mutationId: mutationIdSchema,
    batchId: batchIdSchema.optional(),
    entityId: z.string().nullable(),
    entityType: z.string(),
    versionBefore: z.null(),
    versionAfter: z.null(),
    auditLogId: z.null(),
    errorId: z.string(),
    errorCode: errorCodeSchema,
    isClientFault: z.literal(false),
    retryable: z.boolean(),
    retryAfterMs: z.number().int().nonnegative().optional(),
    retryableReason: retryableReasonSchema.optional(),
  }),
]).meta({
  id: 'MutationReceipt',
  description: 'Discriminated-union mutation receipt',
});

export type MutationReceiptInput = z.input<typeof mutationReceiptSchema>;
