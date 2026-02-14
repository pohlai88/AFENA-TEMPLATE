import { z } from 'zod';

export const ItemTaxTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  company: z.string(),
  disabled: z.boolean().optional().default(false),
  taxes: z.array(z.unknown()),
});

export type ItemTaxTemplate = z.infer<typeof ItemTaxTemplateSchema>;

export const ItemTaxTemplateInsertSchema = ItemTaxTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemTaxTemplateInsert = z.infer<typeof ItemTaxTemplateInsertSchema>;
