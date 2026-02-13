import { z } from 'zod';

export const ProcessPeriodClosingVoucherSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  parent_pcv: z.string(),
  status: z.enum(['Queued', 'Running', 'Paused', 'Completed', 'Cancelled']).optional().default('Queued'),
  p_l_closing_balance: z.unknown().optional(),
  normal_balances: z.array(z.unknown()).optional(),
  bs_closing_balance: z.unknown().optional(),
  z_opening_balances: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
});

export type ProcessPeriodClosingVoucher = z.infer<typeof ProcessPeriodClosingVoucherSchema>;

export const ProcessPeriodClosingVoucherInsertSchema = ProcessPeriodClosingVoucherSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessPeriodClosingVoucherInsert = z.infer<typeof ProcessPeriodClosingVoucherInsertSchema>;
