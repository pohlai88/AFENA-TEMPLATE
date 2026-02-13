import { z } from 'zod';

export const LandedCostTaxesAndChargesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  expense_account: z.string().optional(),
  account_currency: z.string().optional(),
  exchange_rate: z.number().optional(),
  description: z.string(),
  amount: z.number(),
  base_amount: z.number().optional(),
  has_corrective_cost: z.boolean().optional().default(false),
  has_operating_cost: z.boolean().optional().default(false),
});

export type LandedCostTaxesAndCharges = z.infer<typeof LandedCostTaxesAndChargesSchema>;

export const LandedCostTaxesAndChargesInsertSchema = LandedCostTaxesAndChargesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LandedCostTaxesAndChargesInsert = z.infer<typeof LandedCostTaxesAndChargesInsertSchema>;
