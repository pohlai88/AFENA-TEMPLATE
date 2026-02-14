import { z } from 'zod';

export const ContractTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string().optional(),
  contract_terms: z.string().optional(),
  requires_fulfilment: z.boolean().optional().default(false),
  fulfilment_terms: z.array(z.unknown()).optional(),
  contract_template_help: z.string().optional(),
});

export type ContractTemplate = z.infer<typeof ContractTemplateSchema>;

export const ContractTemplateInsertSchema = ContractTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ContractTemplateInsert = z.infer<typeof ContractTemplateInsertSchema>;
