import { z } from 'zod';

export const MonthlyDistributionPercentageSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  month: z.string(),
  percentage_allocation: z.number().optional(),
});

export type MonthlyDistributionPercentage = z.infer<typeof MonthlyDistributionPercentageSchema>;

export const MonthlyDistributionPercentageInsertSchema = MonthlyDistributionPercentageSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MonthlyDistributionPercentageInsert = z.infer<typeof MonthlyDistributionPercentageInsertSchema>;
