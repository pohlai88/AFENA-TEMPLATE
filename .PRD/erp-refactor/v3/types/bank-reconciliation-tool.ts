import { z } from 'zod';

export const BankReconciliationToolSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  bank_account: z.string().optional(),
  bank_statement_from_date: z.string().optional(),
  bank_statement_to_date: z.string().optional(),
  from_reference_date: z.string().optional(),
  to_reference_date: z.string().optional(),
  filter_by_reference_date: z.boolean().optional().default(false),
  account_currency: z.string().optional(),
  account_opening_balance: z.number().optional(),
  bank_statement_closing_balance: z.number().optional(),
  reconciliation_tool_cards: z.string().optional(),
  reconciliation_tool_dt: z.string().optional(),
  no_bank_transactions: z.string().optional(),
});

export type BankReconciliationTool = z.infer<typeof BankReconciliationToolSchema>;

export const BankReconciliationToolInsertSchema = BankReconciliationToolSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankReconciliationToolInsert = z.infer<typeof BankReconciliationToolInsertSchema>;
