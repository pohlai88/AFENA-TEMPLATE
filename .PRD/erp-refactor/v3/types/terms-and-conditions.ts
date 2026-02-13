import { z } from 'zod';

export const TermsAndConditionsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  disabled: z.boolean().optional().default(false),
  selling: z.boolean().optional().default(true),
  buying: z.boolean().optional().default(true),
  terms: z.string().optional(),
  terms_and_conditions_help: z.string().optional(),
});

export type TermsAndConditions = z.infer<typeof TermsAndConditionsSchema>;

export const TermsAndConditionsInsertSchema = TermsAndConditionsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TermsAndConditionsInsert = z.infer<typeof TermsAndConditionsInsertSchema>;
