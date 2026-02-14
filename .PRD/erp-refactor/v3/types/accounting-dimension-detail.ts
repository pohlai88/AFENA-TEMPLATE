import { z } from 'zod';

export const AccountingDimensionDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  reference_document: z.string().optional(),
  default_dimension: z.string().optional(),
  mandatory_for_bs: z.boolean().optional().default(false),
  mandatory_for_pl: z.boolean().optional().default(false),
  automatically_post_balancing_accounting_entry: z.boolean().optional().default(false),
  offsetting_account: z.string().optional(),
});

export type AccountingDimensionDetail = z.infer<typeof AccountingDimensionDetailSchema>;

export const AccountingDimensionDetailInsertSchema = AccountingDimensionDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountingDimensionDetailInsert = z.infer<typeof AccountingDimensionDetailInsertSchema>;
