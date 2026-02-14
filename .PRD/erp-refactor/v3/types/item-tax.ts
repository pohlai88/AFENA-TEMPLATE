import { z } from 'zod';

export const ItemTaxSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_tax_template: z.string(),
  tax_category: z.string().optional(),
  valid_from: z.string().optional(),
  minimum_net_rate: z.number().optional(),
  maximum_net_rate: z.number().optional(),
});

export type ItemTax = z.infer<typeof ItemTaxSchema>;

export const ItemTaxInsertSchema = ItemTaxSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemTaxInsert = z.infer<typeof ItemTaxInsertSchema>;
