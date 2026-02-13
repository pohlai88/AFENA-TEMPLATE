import { z } from 'zod';

export const ItemTaxTemplateDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  tax_type: z.string(),
  tax_rate: z.number().optional(),
});

export type ItemTaxTemplateDetail = z.infer<typeof ItemTaxTemplateDetailSchema>;

export const ItemTaxTemplateDetailInsertSchema = ItemTaxTemplateDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemTaxTemplateDetailInsert = z.infer<typeof ItemTaxTemplateDetailInsertSchema>;
