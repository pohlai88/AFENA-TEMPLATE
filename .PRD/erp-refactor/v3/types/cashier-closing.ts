import { z } from 'zod';

export const CashierClosingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['POS-CLO-']).optional().default('POS-CLO-'),
  user: z.string(),
  date: z.string().optional().default('Today'),
  from_time: z.string(),
  time: z.string(),
  expense: z.number().optional().default(0),
  custody: z.number().optional().default(0),
  returns: z.number().optional().default(0),
  outstanding_amount: z.number().optional().default(0),
  payments: z.array(z.unknown()).optional(),
  net_amount: z.number().optional(),
  amended_from: z.string().optional(),
});

export type CashierClosing = z.infer<typeof CashierClosingSchema>;

export const CashierClosingInsertSchema = CashierClosingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CashierClosingInsert = z.infer<typeof CashierClosingInsertSchema>;
