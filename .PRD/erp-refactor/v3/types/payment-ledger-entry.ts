import { z } from 'zod';

export const PaymentLedgerEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  posting_date: z.string().optional(),
  company: z.string().optional(),
  account_type: z.enum(['Receivable', 'Payable']).optional(),
  account: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  due_date: z.string().optional(),
  voucher_detail_no: z.string().optional(),
  cost_center: z.string().optional(),
  finance_book: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  against_voucher_type: z.string().optional(),
  against_voucher_no: z.string().optional(),
  amount: z.number().optional(),
  account_currency: z.string().optional(),
  amount_in_account_currency: z.number().optional(),
  delinked: z.boolean().optional().default(false),
  remarks: z.string().optional(),
  project: z.string().optional(),
});

export type PaymentLedgerEntry = z.infer<typeof PaymentLedgerEntrySchema>;

export const PaymentLedgerEntryInsertSchema = PaymentLedgerEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentLedgerEntryInsert = z.infer<typeof PaymentLedgerEntryInsertSchema>;
