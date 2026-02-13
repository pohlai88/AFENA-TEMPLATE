import { z } from 'zod';

export const AssetRepairConsumedItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  warehouse: z.string(),
  valuation_rate: z.number().optional(),
  consumed_quantity: z.string().optional(),
  total_value: z.number().optional(),
  serial_no: z.string().optional(),
  serial_and_batch_bundle: z.string().optional(),
});

export type AssetRepairConsumedItem = z.infer<typeof AssetRepairConsumedItemSchema>;

export const AssetRepairConsumedItemInsertSchema = AssetRepairConsumedItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetRepairConsumedItemInsert = z.infer<typeof AssetRepairConsumedItemInsertSchema>;
