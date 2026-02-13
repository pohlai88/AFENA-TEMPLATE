import { z } from 'zod';

export const PaymentTermsTemplateDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  payment_term: z.string().optional(),
  description: z.string().optional(),
  invoice_portion: z.number(),
  mode_of_payment: z.string().optional(),
  due_date_based_on: z.enum(['Day(s) after invoice date', 'Day(s) after the end of the invoice month', 'Month(s) after the end of the invoice month']),
  credit_days: z.number().int().optional().default(0),
  credit_months: z.number().int().optional().default(0),
  discount_type: z.enum(['Percentage', 'Amount']).optional().default('Percentage'),
  discount: z.number().optional(),
  discount_validity_based_on: z.enum(['Day(s) after invoice date', 'Day(s) after the end of the invoice month', 'Month(s) after the end of the invoice month']).optional().default('Day(s) after invoice date'),
  discount_validity: z.number().int().optional(),
});

export type PaymentTermsTemplateDetail = z.infer<typeof PaymentTermsTemplateDetailSchema>;

export const PaymentTermsTemplateDetailInsertSchema = PaymentTermsTemplateDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentTermsTemplateDetailInsert = z.infer<typeof PaymentTermsTemplateDetailInsertSchema>;
