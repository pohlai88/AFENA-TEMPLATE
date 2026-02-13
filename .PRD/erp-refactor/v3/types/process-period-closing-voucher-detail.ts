import { z } from 'zod';

export const ProcessPeriodClosingVoucherDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  processing_date: z.string().optional(),
  report_type: z.enum(['Profit and Loss', 'Balance Sheet']).optional().default('Profit and Loss'),
  status: z.enum(['Queued', 'Running', 'Paused', 'Completed', 'Cancelled']).optional().default('Queued'),
  closing_balance: z.unknown().optional(),
});

export type ProcessPeriodClosingVoucherDetail = z.infer<typeof ProcessPeriodClosingVoucherDetailSchema>;

export const ProcessPeriodClosingVoucherDetailInsertSchema = ProcessPeriodClosingVoucherDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessPeriodClosingVoucherDetailInsert = z.infer<typeof ProcessPeriodClosingVoucherDetailInsertSchema>;
