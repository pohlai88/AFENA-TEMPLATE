import { z } from 'zod';

export const OpportunityTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  description: z.string().optional(),
});

export type OpportunityType = z.infer<typeof OpportunityTypeSchema>;

export const OpportunityTypeInsertSchema = OpportunityTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OpportunityTypeInsert = z.infer<typeof OpportunityTypeInsertSchema>;
