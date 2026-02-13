import { z } from 'zod';

export const LedgerHealthMonitorSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  enable_health_monitor: z.boolean().optional().default(false),
  monitor_for_last_x_days: z.number().int().default(60),
  debit_credit_mismatch: z.boolean().optional().default(false),
  general_and_payment_ledger_mismatch: z.boolean().optional().default(false),
  companies: z.array(z.unknown()).optional(),
});

export type LedgerHealthMonitor = z.infer<typeof LedgerHealthMonitorSchema>;

export const LedgerHealthMonitorInsertSchema = LedgerHealthMonitorSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LedgerHealthMonitorInsert = z.infer<typeof LedgerHealthMonitorInsertSchema>;
