import { z } from 'zod';

export const AssetFinanceBookSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  finance_book: z.string().optional(),
  depreciation_method: z.enum(['Straight Line', 'Double Declining Balance', 'Written Down Value', 'Manual']),
  frequency_of_depreciation: z.number().int(),
  total_number_of_depreciations: z.number().int(),
  increase_in_asset_life: z.number().int().optional(),
  depreciation_start_date: z.string().optional(),
  salvage_value_percentage: z.number().optional(),
  expected_value_after_useful_life: z.number().optional().default(0),
  rate_of_depreciation: z.number().optional(),
  daily_prorata_based: z.boolean().optional().default(false),
  shift_based: z.boolean().optional().default(false),
  value_after_depreciation: z.number().optional(),
  total_number_of_booked_depreciations: z.number().int().optional().default(0),
});

export type AssetFinanceBook = z.infer<typeof AssetFinanceBookSchema>;

export const AssetFinanceBookInsertSchema = AssetFinanceBookSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetFinanceBookInsert = z.infer<typeof AssetFinanceBookInsertSchema>;
