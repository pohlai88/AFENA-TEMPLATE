import { z } from 'zod';

export const TaxWithholdingRateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  from_date: z.string(),
  to_date: z.string(),
  tax_withholding_group: z.string().optional(),
  tax_withholding_rate: z.number(),
  cumulative_threshold: z.number().optional(),
  single_threshold: z.number().optional(),
});

export type TaxWithholdingRate = z.infer<typeof TaxWithholdingRateSchema>;

export const TaxWithholdingRateInsertSchema = TaxWithholdingRateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaxWithholdingRateInsert = z.infer<typeof TaxWithholdingRateInsertSchema>;
