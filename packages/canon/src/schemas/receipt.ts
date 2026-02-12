import { z } from 'zod';

import { errorCodeSchema } from './errors';

export const receiptStatusSchema = z.enum(['ok', 'rejected', 'error']);

export const receiptSchema = z.object({
  requestId: z.string(),
  mutationId: z.string().uuid(),
  batchId: z.string().uuid().optional(),
  entityId: z.string().uuid().nullable(),
  entityType: z.string(),
  versionBefore: z.number().int().nullable(),
  versionAfter: z.number().int().nullable(),
  status: receiptStatusSchema,
  auditLogId: z.string().uuid().nullable(),
  errorCode: errorCodeSchema.optional(),
});
