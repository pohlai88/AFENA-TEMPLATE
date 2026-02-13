import { z } from 'zod';

export const ServiceLevelPrioritySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  default_priority: z.boolean().optional().default(false),
  priority: z.string(),
  response_time: z.number(),
  resolution_time: z.number().optional(),
});

export type ServiceLevelPriority = z.infer<typeof ServiceLevelPrioritySchema>;

export const ServiceLevelPriorityInsertSchema = ServiceLevelPrioritySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ServiceLevelPriorityInsert = z.infer<typeof ServiceLevelPriorityInsertSchema>;
