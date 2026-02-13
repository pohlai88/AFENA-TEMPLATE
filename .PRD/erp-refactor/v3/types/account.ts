import { z } from 'zod';

export const AccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  account_name: z.string(),
  account_number: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  company: z.string(),
  root_type: z.enum(['Asset', 'Liability', 'Income', 'Expense', 'Equity']).optional(),
  report_type: z.enum(['Balance Sheet', 'Profit and Loss']).optional(),
  account_currency: z.string().optional(),
  parent_account: z.string(),
  account_category: z.string().optional(),
  account_type: z.enum(['Accumulated Depreciation', 'Asset Received But Not Billed', 'Bank', 'Cash', 'Chargeable', 'Capital Work in Progress', 'Cost of Goods Sold', 'Current Asset', 'Current Liability', 'Depreciation', 'Direct Expense', 'Direct Income', 'Equity', 'Expense Account', 'Expenses Included In Asset Valuation', 'Expenses Included In Valuation', 'Fixed Asset', 'Income Account', 'Indirect Expense', 'Indirect Income', 'Liability', 'Payable', 'Receivable', 'Round Off', 'Round Off for Opening', 'Stock', 'Stock Adjustment', 'Stock Received But Not Billed', 'Service Received But Not Billed', 'Tax', 'Temporary']).optional(),
  tax_rate: z.number().optional(),
  freeze_account: z.enum(['No', 'Yes']).optional(),
  balance_must_be: z.enum(['Debit', 'Credit']).optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
  include_in_gross: z.boolean().optional().default(false),
});

export type Account = z.infer<typeof AccountSchema>;

export const AccountInsertSchema = AccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountInsert = z.infer<typeof AccountInsertSchema>;
