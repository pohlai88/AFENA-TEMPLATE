import { z } from 'zod';

export const BankAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account_name: z.string(),
  account: z.string().optional(),
  bank: z.string(),
  account_type: z.string().optional(),
  account_subtype: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  is_default: z.boolean().optional().default(false),
  is_company_account: z.boolean().optional().default(false),
  company: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  iban: z.string().max(34).optional(),
  branch_code: z.string().optional(),
  bank_account_no: z.string().max(30).optional(),
  address_html: z.string().optional(),
  contact_html: z.string().optional(),
  integration_id: z.string().optional(),
  last_integration_date: z.string().optional(),
  mask: z.string().optional(),
});

export type BankAccount = z.infer<typeof BankAccountSchema>;

export const BankAccountInsertSchema = BankAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankAccountInsert = z.infer<typeof BankAccountInsertSchema>;
