import { z } from 'zod';

export const BudgetAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string(),
  budget_amount: z.number(),
});

export type BudgetAccount = z.infer<typeof BudgetAccountSchema>;

export const BudgetAccountInsertSchema = BudgetAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BudgetAccountInsert = z.infer<typeof BudgetAccountInsertSchema>;
