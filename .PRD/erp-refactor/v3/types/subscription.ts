import { z } from 'zod';

export const SubscriptionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  party_type: z.string(),
  party: z.string(),
  company: z.string().optional(),
  status: z.enum(['Trialing', 'Active', 'Grace Period', 'Cancelled', 'Unpaid', 'Completed']).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  cancelation_date: z.string().optional(),
  trial_period_start: z.string().optional(),
  trial_period_end: z.string().optional(),
  follow_calendar_months: z.boolean().optional().default(false),
  generate_new_invoices_past_due_date: z.boolean().optional().default(false),
  submit_invoice: z.boolean().optional().default(true),
  current_invoice_start: z.string().optional(),
  current_invoice_end: z.string().optional(),
  days_until_due: z.number().int().optional().default(0),
  generate_invoice_at: z.enum(['End of the current subscription period', 'Beginning of the current subscription period', 'Days before the current subscription period']).default('End of the current subscription period'),
  number_of_days: z.number().int().optional(),
  cancel_at_period_end: z.boolean().optional().default(false),
  plans: z.array(z.unknown()),
  sales_tax_template: z.string().optional(),
  purchase_tax_template: z.string().optional(),
  apply_additional_discount: z.enum(['Grand Total', 'Net Total']).optional(),
  additional_discount_percentage: z.number().optional(),
  additional_discount_amount: z.number().optional(),
  cost_center: z.string().optional(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

export const SubscriptionInsertSchema = SubscriptionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubscriptionInsert = z.infer<typeof SubscriptionInsertSchema>;
