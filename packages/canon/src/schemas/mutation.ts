import { z } from 'zod';

import { actionTypeSchema } from './action';
import { batchIdSchema } from './branded';
import { entityRefSchema } from './entity';
import { jsonValueSchema } from './json-value';

export const mutationSpecSchema = z.object({
  actionType: actionTypeSchema,
  entityRef: entityRefSchema,
  input: jsonValueSchema,
  expectedVersion: z.number().int().positive().optional(),
  batchId: batchIdSchema.optional(),
  reason: z.string().optional(),
  idempotencyKey: z.string().optional(),
}).meta({
  id: 'MutationSpec',
  description: 'Specification for a mutation operation with branded batch ID',
});
