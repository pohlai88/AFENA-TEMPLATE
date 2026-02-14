import { z } from 'zod';

export const OpportunityLostReasonDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  lost_reason: z.string().optional(),
});

export type OpportunityLostReasonDetail = z.infer<typeof OpportunityLostReasonDetailSchema>;

export const OpportunityLostReasonDetailInsertSchema = OpportunityLostReasonDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OpportunityLostReasonDetailInsert = z.infer<typeof OpportunityLostReasonDetailInsertSchema>;
