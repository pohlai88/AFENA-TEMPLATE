import { z } from 'zod';

export const CostCenterAllocationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  main_cost_center: z.string(),
  company: z.string(),
  valid_from: z.string().default('Today'),
  allocation_percentages: z.array(z.unknown()),
  amended_from: z.string().optional(),
});

export type CostCenterAllocation = z.infer<typeof CostCenterAllocationSchema>;

export const CostCenterAllocationInsertSchema = CostCenterAllocationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CostCenterAllocationInsert = z.infer<typeof CostCenterAllocationInsertSchema>;
