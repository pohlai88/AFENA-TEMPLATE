import { z } from 'zod';

export const JournalEntryAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string(),
  account_type: z.string().optional(),
  bank_account: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  cost_center: z.string().optional().default(':Company'),
  project: z.string().optional(),
  account_currency: z.string().optional(),
  exchange_rate: z.number().optional(),
  debit_in_account_currency: z.number().optional(),
  debit: z.number().optional(),
  credit_in_account_currency: z.number().optional(),
  credit: z.number().optional(),
  reference_type: z.enum(['Sales Invoice', 'Purchase Invoice', 'Journal Entry', 'Sales Order', 'Purchase Order', 'Expense Claim', 'Asset', 'Loan', 'Payroll Entry', 'Employee Advance', 'Exchange Rate Revaluation', 'Invoice Discounting', 'Fees', 'Full and Final Statement', 'Payment Entry']).optional(),
  reference_name: z.string().optional(),
  reference_due_date: z.string().optional(),
  reference_detail_no: z.string().optional(),
  advance_voucher_type: z.string().optional(),
  advance_voucher_no: z.string().optional(),
  is_tax_withholding_account: z.boolean().optional().default(false),
  is_advance: z.enum(['No', 'Yes']).optional(),
  user_remark: z.string().optional(),
  against_account: z.string().optional(),
});

export type JournalEntryAccount = z.infer<typeof JournalEntryAccountSchema>;

export const JournalEntryAccountInsertSchema = JournalEntryAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JournalEntryAccountInsert = z.infer<typeof JournalEntryAccountInsertSchema>;
