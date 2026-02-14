import { z } from 'zod';

export const BankTransactionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['ACC-BTN-.YYYY.-']).default('ACC-BTN-.YYYY.-'),
  date: z.string().optional(),
  status: z.enum(['Pending', 'Settled', 'Unreconciled', 'Reconciled', 'Cancelled']).optional().default('Pending'),
  bank_account: z.string().optional(),
  company: z.string().optional(),
  amended_from: z.string().optional(),
  deposit: z.number().optional(),
  withdrawal: z.number().optional(),
  currency: z.string().optional(),
  description: z.string().optional(),
  reference_number: z.string().optional(),
  transaction_id: z.string().optional(),
  transaction_type: z.string().max(50).optional(),
  payment_entries: z.array(z.unknown()).optional(),
  allocated_amount: z.number().optional(),
  unallocated_amount: z.number().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  bank_party_name: z.string().optional(),
  bank_party_account_number: z.string().optional(),
  bank_party_iban: z.string().optional(),
  included_fee: z.number().optional(),
  excluded_fee: z.number().optional(),
});

export type BankTransaction = z.infer<typeof BankTransactionSchema>;

export const BankTransactionInsertSchema = BankTransactionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankTransactionInsert = z.infer<typeof BankTransactionInsertSchema>;
