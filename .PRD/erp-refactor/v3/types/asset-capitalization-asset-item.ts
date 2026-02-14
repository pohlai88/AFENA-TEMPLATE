import { z } from 'zod';

export const AssetCapitalizationAssetItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  asset: z.string(),
  asset_name: z.string().optional(),
  finance_book: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  current_asset_value: z.number().optional(),
  asset_value: z.number().optional().default(0),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  fixed_asset_account: z.string().optional(),
});

export type AssetCapitalizationAssetItem = z.infer<typeof AssetCapitalizationAssetItemSchema>;

export const AssetCapitalizationAssetItemInsertSchema = AssetCapitalizationAssetItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetCapitalizationAssetItemInsert = z.infer<typeof AssetCapitalizationAssetItemInsertSchema>;
