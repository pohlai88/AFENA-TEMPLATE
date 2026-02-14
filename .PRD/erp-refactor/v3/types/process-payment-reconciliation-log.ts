import { z } from 'zod';

export const ProcessPaymentReconciliationLogSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  process_pr: z.string(),
  status: z.enum(['Running', 'Paused', 'Reconciled', 'Partially Reconciled', 'Failed', 'Cancelled']).optional(),
  allocated: z.boolean().optional().default(false),
  reconciled: z.boolean().optional().default(false),
  total_allocations: z.number().int().optional(),
  reconciled_entries: z.number().int().optional(),
  error_log: z.string().optional(),
  allocations: z.array(z.unknown()).optional(),
});

export type ProcessPaymentReconciliationLog = z.infer<typeof ProcessPaymentReconciliationLogSchema>;

export const ProcessPaymentReconciliationLogInsertSchema = ProcessPaymentReconciliationLogSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessPaymentReconciliationLogInsert = z.infer<typeof ProcessPaymentReconciliationLogInsertSchema>;
