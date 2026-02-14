import { z } from 'zod';

export const AccountClosingBalanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  closing_date: z.string().optional(),
  account: z.string().optional(),
  cost_center: z.string().optional(),
  debit: z.number().optional(),
  credit: z.number().optional(),
  reporting_currency_exchange_rate: z.number().optional(),
  debit_in_reporting_currency: z.number().optional(),
  credit_in_reporting_currency: z.number().optional(),
  account_currency: z.string().optional(),
  debit_in_account_currency: z.number().optional(),
  credit_in_account_currency: z.number().optional(),
  project: z.string().optional(),
  company: z.string().optional(),
  finance_book: z.string().optional(),
  period_closing_voucher: z.string().optional(),
  is_period_closing_voucher_entry: z.boolean().optional().default(false),
});

export type AccountClosingBalance = z.infer<typeof AccountClosingBalanceSchema>;

export const AccountClosingBalanceInsertSchema = AccountClosingBalanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountClosingBalanceInsert = z.infer<typeof AccountClosingBalanceInsertSchema>;
