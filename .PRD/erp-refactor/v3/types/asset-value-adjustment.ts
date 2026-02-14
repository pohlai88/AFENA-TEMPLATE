import { z } from 'zod';

export const AssetValueAdjustmentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string().optional(),
  asset: z.string(),
  asset_category: z.string().optional(),
  date: z.string(),
  finance_book: z.string().optional(),
  amended_from: z.string().optional(),
  current_asset_value: z.number(),
  new_asset_value: z.number(),
  difference_amount: z.number().optional(),
  difference_account: z.string(),
  journal_entry: z.string().optional(),
  cost_center: z.string().optional(),
});

export type AssetValueAdjustment = z.infer<typeof AssetValueAdjustmentSchema>;

export const AssetValueAdjustmentInsertSchema = AssetValueAdjustmentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetValueAdjustmentInsert = z.infer<typeof AssetValueAdjustmentInsertSchema>;
