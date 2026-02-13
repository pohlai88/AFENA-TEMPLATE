import { z } from 'zod';

export const PaymentScheduleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  payment_term: z.string().optional(),
  description: z.string().optional(),
  due_date: z.string(),
  invoice_portion: z.number().optional(),
  mode_of_payment: z.string().optional(),
  due_date_based_on: z.enum(['Day(s) after invoice date', 'Day(s) after the end of the invoice month', 'Month(s) after the end of the invoice month']).optional(),
  credit_days: z.number().int().optional(),
  credit_months: z.number().int().optional(),
  discount_date: z.string().optional(),
  discount: z.number().optional(),
  discount_type: z.enum(['Percentage', 'Amount']).optional().default('Percentage'),
  discount_validity_based_on: z.enum(['Day(s) after invoice date', 'Day(s) after the end of the invoice month', 'Month(s) after the end of the invoice month']).optional(),
  discount_validity: z.number().int().optional(),
  payment_amount: z.number(),
  outstanding: z.number().optional(),
  paid_amount: z.number().optional(),
  discounted_amount: z.number().optional().default(0),
  base_payment_amount: z.number().optional(),
  base_outstanding: z.number().optional(),
  base_paid_amount: z.number().optional(),
});

export type PaymentSchedule = z.infer<typeof PaymentScheduleSchema>;

export const PaymentScheduleInsertSchema = PaymentScheduleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentScheduleInsert = z.infer<typeof PaymentScheduleInsertSchema>;
