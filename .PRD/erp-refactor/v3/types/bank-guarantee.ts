import { z } from 'zod';

export const BankGuaranteeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  bg_type: z.enum(['Receiving', 'Providing']),
  reference_doctype: z.string().optional(),
  reference_docname: z.string().optional(),
  customer: z.string().optional(),
  supplier: z.string().optional(),
  project: z.string().optional(),
  amount: z.number(),
  start_date: z.string(),
  validity: z.number().int().optional(),
  end_date: z.string().optional(),
  bank: z.string().optional(),
  bank_account: z.string().optional(),
  account: z.string().optional(),
  bank_account_no: z.string().optional(),
  iban: z.string().optional(),
  branch_code: z.string().optional(),
  swift_number: z.string().optional(),
  more_information: z.string().optional(),
  bank_guarantee_number: z.string().optional(),
  name_of_beneficiary: z.string().optional(),
  margin_money: z.number().optional(),
  charges: z.number().optional(),
  fixed_deposit_number: z.string().optional(),
  amended_from: z.string().optional(),
});

export type BankGuarantee = z.infer<typeof BankGuaranteeSchema>;

export const BankGuaranteeInsertSchema = BankGuaranteeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankGuaranteeInsert = z.infer<typeof BankGuaranteeInsertSchema>;
