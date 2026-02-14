import { z } from 'zod';

export const TaxWithholdingAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  account: z.string(),
});

export type TaxWithholdingAccount = z.infer<typeof TaxWithholdingAccountSchema>;

export const TaxWithholdingAccountInsertSchema = TaxWithholdingAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaxWithholdingAccountInsert = z.infer<typeof TaxWithholdingAccountInsertSchema>;
