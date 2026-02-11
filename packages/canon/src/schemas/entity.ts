import { z } from 'zod';

import { ENTITY_TYPES } from '../types/entity';

export const entityTypeSchema = z.enum(ENTITY_TYPES);

export const entityRefSchema = z.object({
  type: entityTypeSchema,
  id: z.string().uuid().optional(),
});
