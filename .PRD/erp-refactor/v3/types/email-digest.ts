import { z } from 'zod';

export const EmailDigestSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  enabled: z.boolean().optional().default(false),
  company: z.string(),
  frequency: z.enum(['Daily', 'Weekly', 'Monthly']),
  next_send: z.string().optional(),
  recipients: z.array(z.unknown()),
  income: z.boolean().optional().default(false),
  expenses_booked: z.boolean().optional().default(false),
  income_year_to_date: z.boolean().optional().default(false),
  expense_year_to_date: z.boolean().optional().default(false),
  bank_balance: z.boolean().optional().default(false),
  credit_balance: z.boolean().optional().default(false),
  invoiced_amount: z.boolean().optional().default(false),
  payables: z.boolean().optional().default(false),
  sales_orders_to_bill: z.boolean().optional().default(false),
  purchase_orders_to_bill: z.boolean().optional().default(false),
  sales_order: z.boolean().optional().default(false),
  purchase_order: z.boolean().optional().default(false),
  sales_orders_to_deliver: z.boolean().optional().default(false),
  purchase_orders_to_receive: z.boolean().optional().default(false),
  sales_invoice: z.boolean().optional().default(false),
  purchase_invoice: z.boolean().optional().default(false),
  new_quotations: z.boolean().optional().default(false),
  pending_quotations: z.boolean().optional().default(false),
  issue: z.boolean().optional().default(false),
  project: z.boolean().optional().default(false),
  purchase_orders_items_overdue: z.boolean().optional().default(false),
  calendar_events: z.boolean().optional().default(false),
  todo_list: z.boolean().optional().default(false),
  notifications: z.boolean().optional().default(false),
  add_quote: z.boolean().optional().default(false),
});

export type EmailDigest = z.infer<typeof EmailDigestSchema>;

export const EmailDigestInsertSchema = EmailDigestSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmailDigestInsert = z.infer<typeof EmailDigestInsertSchema>;
