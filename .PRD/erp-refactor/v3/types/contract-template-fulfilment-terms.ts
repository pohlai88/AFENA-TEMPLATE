import { z } from 'zod';

export const ContractTemplateFulfilmentTermsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  requirement: z.string().optional(),
});

export type ContractTemplateFulfilmentTerms = z.infer<typeof ContractTemplateFulfilmentTermsSchema>;

export const ContractTemplateFulfilmentTermsInsertSchema = ContractTemplateFulfilmentTermsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ContractTemplateFulfilmentTermsInsert = z.infer<typeof ContractTemplateFulfilmentTermsInsertSchema>;
