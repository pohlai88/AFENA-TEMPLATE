import { z } from 'zod';

export const AssetRepairSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['ACC-ASR-.YYYY.-']),
  company: z.string().optional(),
  asset: z.string(),
  asset_name: z.string().optional(),
  repair_status: z.enum(['Pending', 'Completed', 'Cancelled']).optional().default('Pending'),
  failure_date: z.string(),
  completion_date: z.string().optional(),
  downtime: z.string().optional(),
  amended_from: z.string().optional(),
  description: z.string().optional(),
  actions_performed: z.string().optional(),
  invoices: z.array(z.unknown()).optional(),
  repair_cost: z.number().optional().default(0),
  stock_items: z.array(z.unknown()).optional(),
  consumed_items_cost: z.number().optional(),
  capitalize_repair_cost: z.boolean().optional().default(false),
  increase_in_asset_life: z.number().int().optional(),
  total_repair_cost: z.number().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
});

export type AssetRepair = z.infer<typeof AssetRepairSchema>;

export const AssetRepairInsertSchema = AssetRepairSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetRepairInsert = z.infer<typeof AssetRepairInsertSchema>;
