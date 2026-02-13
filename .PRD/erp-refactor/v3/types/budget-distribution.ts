import { z } from 'zod';

export const BudgetDistributionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  amount: z.number().optional(),
  percent: z.number().optional(),
});

export type BudgetDistribution = z.infer<typeof BudgetDistributionSchema>;

export const BudgetDistributionInsertSchema = BudgetDistributionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BudgetDistributionInsert = z.infer<typeof BudgetDistributionInsertSchema>;
