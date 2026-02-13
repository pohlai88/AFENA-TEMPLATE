import { z } from 'zod';

export const ProcessPaymentReconciliationLogAllocationsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  reference_type: z.string(),
  reference_name: z.string(),
  reference_row: z.string().optional(),
  invoice_type: z.string(),
  invoice_number: z.string(),
  allocated_amount: z.number(),
  unreconciled_amount: z.number().optional(),
  amount: z.number().optional(),
  is_advance: z.string().optional(),
  difference_amount: z.number().optional(),
  gain_loss_posting_date: z.string().optional(),
  difference_account: z.string().optional(),
  exchange_rate: z.number().optional(),
  currency: z.string().optional(),
  reconciled: z.boolean().optional().default(false),
});

export type ProcessPaymentReconciliationLogAllocations = z.infer<typeof ProcessPaymentReconciliationLogAllocationsSchema>;

export const ProcessPaymentReconciliationLogAllocationsInsertSchema = ProcessPaymentReconciliationLogAllocationsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessPaymentReconciliationLogAllocationsInsert = z.infer<typeof ProcessPaymentReconciliationLogAllocationsInsertSchema>;
