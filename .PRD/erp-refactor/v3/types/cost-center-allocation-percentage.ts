import { z } from 'zod';

export const CostCenterAllocationPercentageSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  cost_center: z.string(),
  percentage: z.number(),
});

export type CostCenterAllocationPercentage = z.infer<typeof CostCenterAllocationPercentageSchema>;

export const CostCenterAllocationPercentageInsertSchema = CostCenterAllocationPercentageSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CostCenterAllocationPercentageInsert = z.infer<typeof CostCenterAllocationPercentageInsertSchema>;
