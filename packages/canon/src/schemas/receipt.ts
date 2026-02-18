import { z } from 'zod';

import { errorCodeSchema } from './errors';

export const receiptStatusSchema = z.enum(['ok', 'rejected', 'error']);

export const receiptSchema = z.object({
  requestId: z.string(),
  mutationId: z.uuid(),
  batchId: z.uuid().optional(),
  entityId: z.uuid().nullable(),
  entityType: z.string(),
  versionBefore: z.number().int().nullable(),
  versionAfter: z.number().int().nullable(),
  status: receiptStatusSchema,
  auditLogId: z.uuid().nullable(),
  errorCode: errorCodeSchema.optional(),
});
