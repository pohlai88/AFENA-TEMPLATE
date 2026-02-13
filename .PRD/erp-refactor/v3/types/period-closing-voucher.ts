import { z } from 'zod';

export const PeriodClosingVoucherSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  transaction_date: z.string().optional().default('Today'),
  company: z.string(),
  fiscal_year: z.string(),
  period_start_date: z.string(),
  period_end_date: z.string(),
  amended_from: z.string().optional(),
  closing_account_head: z.string(),
  gle_processing_status: z.enum(['In Progress', 'Completed', 'Failed']).optional(),
  remarks: z.string(),
  error_message: z.string().optional(),
});

export type PeriodClosingVoucher = z.infer<typeof PeriodClosingVoucherSchema>;

export const PeriodClosingVoucherInsertSchema = PeriodClosingVoucherSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PeriodClosingVoucherInsert = z.infer<typeof PeriodClosingVoucherInsertSchema>;
