import { z } from 'zod';

import { actionTypeSchema } from './action';
import { entityRefSchema } from './entity';
import { jsonValueSchema } from './json-value';

export const mutationSpecSchema = z.object({
  actionType: actionTypeSchema,
  entityRef: entityRefSchema,
  input: jsonValueSchema,
  expectedVersion: z.number().int().positive().optional(),
  batchId: z.uuid().optional(),
  reason: z.string().optional(),
  idempotencyKey: z.string().optional(),
});
