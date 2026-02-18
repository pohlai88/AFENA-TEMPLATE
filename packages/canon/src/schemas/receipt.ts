import { z } from 'zod';

import { auditLogIdSchema, batchIdSchema, entityIdSchema, mutationIdSchema } from './branded';
import { errorCodeSchema } from './errors';

export const receiptStatusSchema = z.enum(['ok', 'rejected', 'error']);

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
