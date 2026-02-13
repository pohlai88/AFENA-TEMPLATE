import { z } from 'zod';

export const AssetCapitalizationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  title: z.string().optional(),
  naming_series: z.enum(['ACC-ASC-.YYYY.-']),
  company: z.string(),
  target_asset: z.string().optional(),
  target_asset_name: z.string().optional(),
  finance_book: z.string().optional(),
  posting_date: z.string().default('Today'),
  posting_time: z.string().default('Now'),
  set_posting_time: z.boolean().optional().default(false),
  target_item_code: z.string().optional(),
  amended_from: z.string().optional(),
  stock_items: z.array(z.unknown()).optional(),
  stock_items_total: z.number().optional(),
  asset_items: z.array(z.unknown()).optional(),
  asset_items_total: z.number().optional(),
  service_items: z.array(z.unknown()).optional(),
  service_items_total: z.number().optional(),
  total_value: z.number().optional(),
  target_incoming_rate: z.number().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  target_fixed_asset_account: z.string().optional(),
});

export type AssetCapitalization = z.infer<typeof AssetCapitalizationSchema>;

export const AssetCapitalizationInsertSchema = AssetCapitalizationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetCapitalizationInsert = z.infer<typeof AssetCapitalizationInsertSchema>;
