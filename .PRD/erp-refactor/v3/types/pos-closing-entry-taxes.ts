import { z } from 'zod';

export const PosClosingEntryTaxesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account_head: z.string().optional(),
  amount: z.number().optional(),
});

export type PosClosingEntryTaxes = z.infer<typeof PosClosingEntryTaxesSchema>;

export const PosClosingEntryTaxesInsertSchema = PosClosingEntryTaxesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosClosingEntryTaxesInsert = z.infer<typeof PosClosingEntryTaxesInsertSchema>;
