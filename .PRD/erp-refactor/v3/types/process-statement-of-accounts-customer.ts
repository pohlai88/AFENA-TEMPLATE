import { z } from 'zod';

export const ProcessStatementOfAccountsCustomerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  customer: z.string(),
  customer_name: z.string().optional(),
  billing_email: z.string().optional(),
  primary_email: z.string().optional(),
});

export type ProcessStatementOfAccountsCustomer = z.infer<typeof ProcessStatementOfAccountsCustomerSchema>;

export const ProcessStatementOfAccountsCustomerInsertSchema = ProcessStatementOfAccountsCustomerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessStatementOfAccountsCustomerInsert = z.infer<typeof ProcessStatementOfAccountsCustomerInsertSchema>;
