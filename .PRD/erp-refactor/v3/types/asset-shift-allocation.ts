import { z } from 'zod';

export const AssetShiftAllocationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  asset: z.string(),
  naming_series: z.enum(['ACC-ASA-.YYYY.-']),
  finance_book: z.string().optional(),
  amended_from: z.string().optional(),
  depreciation_schedule: z.array(z.unknown()).optional(),
});

export type AssetShiftAllocation = z.infer<typeof AssetShiftAllocationSchema>;

export const AssetShiftAllocationInsertSchema = AssetShiftAllocationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetShiftAllocationInsert = z.infer<typeof AssetShiftAllocationInsertSchema>;
