import { z } from 'zod';

export const MonthlyDistributionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  distribution_id: z.string(),
  fiscal_year: z.string().optional(),
  percentages: z.array(z.unknown()).optional(),
});

export type MonthlyDistribution = z.infer<typeof MonthlyDistributionSchema>;

export const MonthlyDistributionInsertSchema = MonthlyDistributionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MonthlyDistributionInsert = z.infer<typeof MonthlyDistributionInsertSchema>;
