import { z } from 'zod';

import { ERROR_CODES } from '../types/errors';

export const errorCodeSchema = z.enum(ERROR_CODES);

export const kernelErrorSchema = z.object({
  code: errorCodeSchema,
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});
