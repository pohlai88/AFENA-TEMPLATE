import { z } from 'zod';

export const ProspectOpportunitySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  opportunity: z.string().optional(),
  amount: z.number().optional(),
  stage: z.string().optional(),
  deal_owner: z.string().optional(),
  probability: z.number().optional(),
  expected_closing: z.string().optional(),
  currency: z.string().optional(),
  contact_person: z.string().optional(),
});

export type ProspectOpportunity = z.infer<typeof ProspectOpportunitySchema>;

export const ProspectOpportunityInsertSchema = ProspectOpportunitySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProspectOpportunityInsert = z.infer<typeof ProspectOpportunityInsertSchema>;
