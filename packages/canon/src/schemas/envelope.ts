import { z } from 'zod';

import { kernelErrorSchema } from './errors';
import { mutationReceiptSchema } from './receipt';

export const apiResponseSchema = z.object({
  ok: z.boolean(),
  data: z.unknown().optional(),
  error: kernelErrorSchema.optional(),
  meta: z.object({
    requestId: z.string(),
    receipt: mutationReceiptSchema.optional(),
  }),
});
