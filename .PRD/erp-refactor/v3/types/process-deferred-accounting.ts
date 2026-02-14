import { z } from 'zod';

export const ProcessDeferredAccountingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  type: z.enum(['Income', 'Expense']),
  account: z.string().optional(),
  posting_date: z.string().default('Today'),
  start_date: z.string(),
  end_date: z.string(),
  amended_from: z.string().optional(),
});

export type ProcessDeferredAccounting = z.infer<typeof ProcessDeferredAccountingSchema>;

export const ProcessDeferredAccountingInsertSchema = ProcessDeferredAccountingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessDeferredAccountingInsert = z.infer<typeof ProcessDeferredAccountingInsertSchema>;
