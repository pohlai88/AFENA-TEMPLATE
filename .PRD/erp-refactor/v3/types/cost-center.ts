import { z } from 'zod';

export const CostCenterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  cost_center_name: z.string(),
  cost_center_number: z.string().optional(),
  parent_cost_center: z.string(),
  company: z.string(),
  is_group: z.boolean().optional().default(false),
  disabled: z.boolean().optional().default(false),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
});

export type CostCenter = z.infer<typeof CostCenterSchema>;

export const CostCenterInsertSchema = CostCenterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CostCenterInsert = z.infer<typeof CostCenterInsertSchema>;
