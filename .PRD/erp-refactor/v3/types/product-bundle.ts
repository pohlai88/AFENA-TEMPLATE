import { z } from 'zod';

export const ProductBundleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  new_item_code: z.string(),
  description: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  items: z.array(z.unknown()),
  about: z.string().optional(),
});

export type ProductBundle = z.infer<typeof ProductBundleSchema>;

export const ProductBundleInsertSchema = ProductBundleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductBundleInsert = z.infer<typeof ProductBundleInsertSchema>;
