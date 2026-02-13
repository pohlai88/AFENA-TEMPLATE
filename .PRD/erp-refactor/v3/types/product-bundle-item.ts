import { z } from 'zod';

export const ProductBundleItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  qty: z.number(),
  description: z.string().optional(),
  rate: z.number().optional(),
  uom: z.string().optional(),
});

export type ProductBundleItem = z.infer<typeof ProductBundleItemSchema>;

export const ProductBundleItemInsertSchema = ProductBundleItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductBundleItemInsert = z.infer<typeof ProductBundleItemInsertSchema>;
