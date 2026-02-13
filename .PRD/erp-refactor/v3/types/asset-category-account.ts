import { z } from 'zod';

export const AssetCategoryAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company_name: z.string(),
  fixed_asset_account: z.string(),
  accumulated_depreciation_account: z.string().optional(),
  depreciation_expense_account: z.string().optional(),
  capital_work_in_progress_account: z.string().optional(),
});

export type AssetCategoryAccount = z.infer<typeof AssetCategoryAccountSchema>;

export const AssetCategoryAccountInsertSchema = AssetCategoryAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetCategoryAccountInsert = z.infer<typeof AssetCategoryAccountInsertSchema>;
