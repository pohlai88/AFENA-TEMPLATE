import { z } from 'zod';

export const BankClearanceDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  payment_document: z.string().optional(),
  payment_entry: z.string().optional(),
  against_account: z.string().optional(),
  amount: z.string().optional(),
  posting_date: z.string().optional(),
  cheque_number: z.string().optional(),
  cheque_date: z.string().optional(),
  clearance_date: z.string().optional(),
});

export type BankClearanceDetail = z.infer<typeof BankClearanceDetailSchema>;

export const BankClearanceDetailInsertSchema = BankClearanceDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankClearanceDetailInsert = z.infer<typeof BankClearanceDetailInsertSchema>;
