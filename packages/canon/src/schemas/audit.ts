import { z } from 'zod';

import { channelSchema } from '../enums/channel';

import { actionFamilySchema } from './action';
import { jsonValueSchema } from './json-value';

export const auditLogEntrySchema = z.object({
  id: z.uuid(),
  orgId: z.string(),
  actorUserId: z.string(),
  actionType: z.string(),
  actionFamily: actionFamilySchema,
  entityType: z.string(),
  entityId: z.string(),
  requestId: z.string().nullable(),
  mutationId: z.uuid(),
  batchId: z.uuid().nullable(),
  versionBefore: z.number().int().nullable(),
  versionAfter: z.number().int(),
  channel: channelSchema,
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
