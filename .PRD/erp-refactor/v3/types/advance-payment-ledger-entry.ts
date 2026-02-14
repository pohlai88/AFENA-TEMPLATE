import { z } from 'zod';

export const AdvancePaymentLedgerEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  against_voucher_type: z.string().optional(),
  against_voucher_no: z.string().optional(),
  currency: z.string().optional(),
  exchange_rate: z.number().optional(),
  amount: z.number().optional(),
  base_amount: z.number().optional(),
  event: z.string().optional(),
  delinked: z.boolean().optional().default(false),
});

export type AdvancePaymentLedgerEntry = z.infer<typeof AdvancePaymentLedgerEntrySchema>;

export const AdvancePaymentLedgerEntryInsertSchema = AdvancePaymentLedgerEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AdvancePaymentLedgerEntryInsert = z.infer<typeof AdvancePaymentLedgerEntryInsertSchema>;
