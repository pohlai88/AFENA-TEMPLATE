import { z } from 'zod';

export const PurchaseTaxesAndChargesTemplateSchema = z.object({
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

export type PurchaseTaxesAndChargesTemplate = z.infer<typeof PurchaseTaxesAndChargesTemplateSchema>;

export const PurchaseTaxesAndChargesTemplateInsertSchema = PurchaseTaxesAndChargesTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PurchaseTaxesAndChargesTemplateInsert = z.infer<typeof PurchaseTaxesAndChargesTemplateInsertSchema>;
