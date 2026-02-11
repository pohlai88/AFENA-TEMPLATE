import { z } from 'zod';

import { actionFamilySchema } from './action';

const jsonValueSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

export const auditLogEntrySchema = z.object({
  id: z.string().uuid(),
  orgId: z.string(),
  actorUserId: z.string(),
  actionType: z.string(),
  actionFamily: actionFamilySchema,
  entityType: z.string(),
  entityId: z.string(),
  requestId: z.string().nullable(),
  mutationId: z.string().uuid(),
  batchId: z.string().uuid().nullable(),
  versionBefore: z.number().int().nullable(),
  versionAfter: z.number().int(),
  channel: z.string(),
  ip: z.string().nullable(),
  userAgent: z.string().nullable(),
  reason: z.string().nullable(),
  authoritySnapshot: jsonValueSchema.nullable(),
  idempotencyKey: z.string().nullable(),
  affectedCount: z.number().int(),
  valueDelta: jsonValueSchema.nullable(),
  createdAt: z.string(),
  before: jsonValueSchema.nullable(),
  after: jsonValueSchema.nullable(),
  diff: jsonValueSchema.nullable(),
});
