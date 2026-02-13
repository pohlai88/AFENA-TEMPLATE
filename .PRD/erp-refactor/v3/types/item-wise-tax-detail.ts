import { z } from 'zod';

export const ItemWiseTaxDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_row: z.string(),
  tax_row: z.string(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  taxable_amount: z.number().optional(),
});

export type ItemWiseTaxDetail = z.infer<typeof ItemWiseTaxDetailSchema>;

export const ItemWiseTaxDetailInsertSchema = ItemWiseTaxDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemWiseTaxDetailInsert = z.infer<typeof ItemWiseTaxDetailInsertSchema>;
