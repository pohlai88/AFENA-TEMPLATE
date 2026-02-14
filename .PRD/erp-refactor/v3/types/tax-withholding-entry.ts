import { z } from 'zod';

export const TaxWithholdingEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  tax_id: z.string().optional(),
  tax_withholding_category: z.string().optional(),
  tax_withholding_group: z.string().optional(),
  taxable_amount: z.number().optional(),
  tax_rate: z.number().optional(),
  withholding_amount: z.number().optional(),
  taxable_doctype: z.string().optional(),
  taxable_name: z.string().optional(),
  taxable_date: z.string().optional(),
  currency: z.string().optional(),
  conversion_rate: z.number().optional(),
  under_withheld_reason: z.enum(['Threshold Exemption', 'Lower Deduction Certificate']).optional(),
  lower_deduction_certificate: z.string().optional(),
  withholding_doctype: z.string().optional(),
  withholding_name: z.string().optional(),
  withholding_date: z.string().optional(),
  status: z.enum(['Settled', 'Under Withheld', 'Over Withheld', 'Duplicate', 'Cancelled']).optional(),
  created_by_migration: z.boolean().optional().default(false),
});

export type TaxWithholdingEntry = z.infer<typeof TaxWithholdingEntrySchema>;

export const TaxWithholdingEntryInsertSchema = TaxWithholdingEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaxWithholdingEntryInsert = z.infer<typeof TaxWithholdingEntryInsertSchema>;
