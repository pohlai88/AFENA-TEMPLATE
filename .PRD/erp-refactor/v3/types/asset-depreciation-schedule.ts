import { z } from 'zod';

export const AssetDepreciationScheduleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  asset: z.string(),
  naming_series: z.enum(['ACC-ADS-.YYYY.-']).optional(),
  company: z.string().optional(),
  net_purchase_amount: z.number().optional(),
  opening_accumulated_depreciation: z.number().optional(),
  opening_number_of_booked_depreciations: z.number().int().optional(),
  finance_book: z.string().optional(),
  finance_book_id: z.number().int().optional(),
  depreciation_method: z.enum(['Straight Line', 'Double Declining Balance', 'Written Down Value', 'Manual']).optional(),
  total_number_of_depreciations: z.number().int().optional(),
  rate_of_depreciation: z.number().optional(),
  daily_prorata_based: z.boolean().optional().default(false),
  shift_based: z.boolean().optional().default(false),
  frequency_of_depreciation: z.number().int().optional(),
  expected_value_after_useful_life: z.number().optional(),
  value_after_depreciation: z.number().optional(),
  depreciation_schedule: z.array(z.unknown()).optional(),
  notes: z.string().optional(),
  status: z.enum(['Draft', 'Active', 'Cancelled']).optional(),
  amended_from: z.string().optional(),
});

export type AssetDepreciationSchedule = z.infer<typeof AssetDepreciationScheduleSchema>;

export const AssetDepreciationScheduleInsertSchema = AssetDepreciationScheduleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetDepreciationScheduleInsert = z.infer<typeof AssetDepreciationScheduleInsertSchema>;
