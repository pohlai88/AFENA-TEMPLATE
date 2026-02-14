import { z } from 'zod';

export const ActivityTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  activity_type: z.string(),
  costing_rate: z.number().optional(),
  billing_rate: z.number().optional(),
  disabled: z.boolean().optional().default(false),
});

export type ActivityType = z.infer<typeof ActivityTypeSchema>;

export const ActivityTypeInsertSchema = ActivityTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ActivityTypeInsert = z.infer<typeof ActivityTypeInsertSchema>;
