import { z } from 'zod';

export const WorkstationCostSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  operating_component: z.string(),
  operating_cost: z.number(),
});

export type WorkstationCost = z.infer<typeof WorkstationCostSchema>;

export const WorkstationCostInsertSchema = WorkstationCostSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkstationCostInsert = z.infer<typeof WorkstationCostInsertSchema>;
