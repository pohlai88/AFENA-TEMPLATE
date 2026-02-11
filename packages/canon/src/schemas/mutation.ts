import { z } from 'zod';

import { actionTypeSchema } from './action';
import { entityRefSchema } from './entity';

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

export const mutationSpecSchema = z.object({
  actionType: actionTypeSchema,
  entityRef: entityRefSchema,
  input: jsonValueSchema,
  expectedVersion: z.number().int().positive().optional(),
  batchId: z.string().uuid().optional(),
  reason: z.string().optional(),
  idempotencyKey: z.string().optional(),
});
