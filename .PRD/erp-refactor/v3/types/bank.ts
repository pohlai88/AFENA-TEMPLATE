import { z } from 'zod';

export const BankSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  bank_name: z.string(),
  swift_number: z.string().optional(),
  website: z.string().optional(),
  address_html: z.string().optional(),
  contact_html: z.string().optional(),
  bank_transaction_mapping: z.array(z.unknown()).optional(),
  plaid_access_token: z.string().optional(),
});

export type Bank = z.infer<typeof BankSchema>;

export const BankInsertSchema = BankSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankInsert = z.infer<typeof BankInsertSchema>;
