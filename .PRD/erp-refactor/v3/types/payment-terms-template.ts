import { z } from 'zod';

export const PaymentTermsTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  template_name: z.string().optional(),
  allocate_payment_based_on_payment_terms: z.boolean().optional().default(false),
  terms: z.array(z.unknown()),
});

export type PaymentTermsTemplate = z.infer<typeof PaymentTermsTemplateSchema>;

export const PaymentTermsTemplateInsertSchema = PaymentTermsTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentTermsTemplateInsert = z.infer<typeof PaymentTermsTemplateInsertSchema>;
