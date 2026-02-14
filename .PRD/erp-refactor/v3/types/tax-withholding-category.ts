import { z } from 'zod';

export const TaxWithholdingCategorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  category_name: z.string().optional(),
  tax_deduction_basis: z.enum(['Gross Total', 'Net Total']).default('Net Total'),
  round_off_tax_amount: z.boolean().optional().default(false),
  tax_on_excess_amount: z.boolean().optional().default(false),
  disable_cumulative_threshold: z.boolean().optional().default(false),
  disable_transaction_threshold: z.boolean().optional().default(false),
  rates: z.array(z.unknown()),
  accounts: z.array(z.unknown()),
});

export type TaxWithholdingCategory = z.infer<typeof TaxWithholdingCategorySchema>;

export const TaxWithholdingCategoryInsertSchema = TaxWithholdingCategorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaxWithholdingCategoryInsert = z.infer<typeof TaxWithholdingCategoryInsertSchema>;
