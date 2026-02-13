import { z } from 'zod';

export const AssetCategorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  asset_category_name: z.string(),
  enable_cwip_accounting: z.boolean().optional().default(false),
  non_depreciable_category: z.boolean().optional().default(false),
  finance_books: z.array(z.unknown()).optional(),
  accounts: z.array(z.unknown()),
});

export type AssetCategory = z.infer<typeof AssetCategorySchema>;

export const AssetCategoryInsertSchema = AssetCategorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetCategoryInsert = z.infer<typeof AssetCategoryInsertSchema>;
