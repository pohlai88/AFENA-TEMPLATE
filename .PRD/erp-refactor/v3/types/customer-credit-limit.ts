import { z } from 'zod';

export const CustomerCreditLimitSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  credit_limit: z.number().optional(),
  bypass_credit_limit_check: z.boolean().optional().default(false),
});

export type CustomerCreditLimit = z.infer<typeof CustomerCreditLimitSchema>;

export const CustomerCreditLimitInsertSchema = CustomerCreditLimitSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CustomerCreditLimitInsert = z.infer<typeof CustomerCreditLimitInsertSchema>;
