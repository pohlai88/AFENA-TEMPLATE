import { z } from 'zod';

export const AssetCapitalizationServiceItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  expense_account: z.string(),
  qty: z.number().optional().default(1),
  uom: z.string().optional(),
  rate: z.number().optional(),
  amount: z.number().optional().default(0),
  cost_center: z.string().optional(),
});

export type AssetCapitalizationServiceItem = z.infer<typeof AssetCapitalizationServiceItemSchema>;

export const AssetCapitalizationServiceItemInsertSchema = AssetCapitalizationServiceItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetCapitalizationServiceItemInsert = z.infer<typeof AssetCapitalizationServiceItemInsertSchema>;
