import { z } from 'zod';

export const ActivityCostSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  activity_type: z.string(),
  employee: z.string().optional(),
  employee_name: z.string().optional(),
  department: z.string().optional(),
  billing_rate: z.number().optional().default(0),
  costing_rate: z.number().optional().default(0),
  title: z.string().optional(),
});

export type ActivityCost = z.infer<typeof ActivityCostSchema>;

export const ActivityCostInsertSchema = ActivityCostSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ActivityCostInsert = z.infer<typeof ActivityCostInsertSchema>;
