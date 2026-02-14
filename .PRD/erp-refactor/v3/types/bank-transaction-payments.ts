import { z } from 'zod';

export const BankTransactionPaymentsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  payment_document: z.string(),
  payment_entry: z.string(),
  allocated_amount: z.number(),
  clearance_date: z.string().optional(),
});

export type BankTransactionPayments = z.infer<typeof BankTransactionPaymentsSchema>;

export const BankTransactionPaymentsInsertSchema = BankTransactionPaymentsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankTransactionPaymentsInsert = z.infer<typeof BankTransactionPaymentsInsertSchema>;
