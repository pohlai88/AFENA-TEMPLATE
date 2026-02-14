import { z } from 'zod';

export const SalesTaxesAndChargesTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  is_default: z.boolean().optional().default(false),
  disabled: z.boolean().optional().default(false),
  company: z.string(),
  tax_category: z.string().optional(),
  taxes: z.array(z.unknown()).optional(),
});

export type SalesTaxesAndChargesTemplate = z.infer<typeof SalesTaxesAndChargesTemplateSchema>;

export const SalesTaxesAndChargesTemplateInsertSchema = SalesTaxesAndChargesTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesTaxesAndChargesTemplateInsert = z.infer<typeof SalesTaxesAndChargesTemplateInsertSchema>;
