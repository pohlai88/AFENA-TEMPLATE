import { z } from 'zod';

export const OpportunityLostReasonSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  lost_reason: z.string().optional(),
});

export type OpportunityLostReason = z.infer<typeof OpportunityLostReasonSchema>;

export const OpportunityLostReasonInsertSchema = OpportunityLostReasonSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OpportunityLostReasonInsert = z.infer<typeof OpportunityLostReasonInsertSchema>;
