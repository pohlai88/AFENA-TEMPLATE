import { z } from 'zod';

import { entityIdSchema } from './branded';

import { ENTITY_TYPES } from '../types/entity';

export const entityTypeSchema = z.enum(ENTITY_TYPES);

export const entityRefSchema = z.object({
  type: entityTypeSchema,
  id: entityIdSchema.optional(),
}).meta({
  id: 'EntityRef',
  description: 'Reference to a specific entity instance with branded ID',
});
