import { z } from 'zod';

export const BomOperationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  operation: z.string(),
  sequence_id: z.number().int().optional(),
  finished_good: z.string().optional(),
  finished_good_qty: z.number().optional().default(1),
  bom_no: z.string().optional(),
  workstation_type: z.string().optional(),
  workstation: z.string().optional(),
  time_in_mins: z.number(),
  fixed_time: z.boolean().optional().default(false),
  is_subcontracted: z.boolean().optional().default(false),
  is_final_finished_good: z.boolean().optional().default(false),
  set_cost_based_on_bom_qty: z.boolean().optional().default(false),
  skip_material_transfer: z.boolean().optional().default(false),
  backflush_from_wip_warehouse: z.boolean().optional().default(false),
  source_warehouse: z.string().optional(),
  wip_warehouse: z.string().optional(),
  fg_warehouse: z.string().optional(),
  hour_rate: z.number().optional(),
  base_hour_rate: z.number().optional(),
  batch_size: z.number().int().optional(),
  cost_per_unit: z.number().optional(),
  base_cost_per_unit: z.number().optional(),
  operating_cost: z.number().optional(),
  base_operating_cost: z.number().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export type BomOperation = z.infer<typeof BomOperationSchema>;

export const BomOperationInsertSchema = BomOperationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomOperationInsert = z.infer<typeof BomOperationInsertSchema>;
