import { z } from 'zod';

export const GlEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  posting_date: z.string().optional(),
  transaction_date: z.string().optional(),
  fiscal_year: z.string().optional(),
  due_date: z.string().optional(),
  account: z.string().optional(),
  account_currency: z.string().optional(),
  against: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  voucher_subtype: z.string().optional(),
  transaction_currency: z.string().optional(),
  against_voucher_type: z.string().optional(),
  against_voucher: z.string().optional(),
  voucher_detail_no: z.string().optional(),
  transaction_exchange_rate: z.number().optional(),
  reporting_currency_exchange_rate: z.number().optional(),
  debit_in_account_currency: z.number().optional(),
  debit: z.number().optional(),
  debit_in_transaction_currency: z.number().optional(),
  debit_in_reporting_currency: z.number().optional(),
  credit_in_account_currency: z.number().optional(),
  credit: z.number().optional(),
  credit_in_transaction_currency: z.number().optional(),
  credit_in_reporting_currency: z.number().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  finance_book: z.string().optional(),
  company: z.string().optional(),
  is_opening: z.enum(['No', 'Yes']).optional(),
  is_advance: z.enum(['No', 'Yes']).optional(),
  to_rename: z.boolean().optional().default(true),
  is_cancelled: z.boolean().optional().default(false),
  remarks: z.string().optional(),
});

export type GlEntry = z.infer<typeof GlEntrySchema>;

export const GlEntryInsertSchema = GlEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type GlEntryInsert = z.infer<typeof GlEntryInsertSchema>;
