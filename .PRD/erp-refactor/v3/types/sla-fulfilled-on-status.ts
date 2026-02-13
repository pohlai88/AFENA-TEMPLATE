import { z } from 'zod';

export const SlaFulfilledOnStatusSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  status: z.string(),
});

export type SlaFulfilledOnStatus = z.infer<typeof SlaFulfilledOnStatusSchema>;

export const SlaFulfilledOnStatusInsertSchema = SlaFulfilledOnStatusSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SlaFulfilledOnStatusInsert = z.infer<typeof SlaFulfilledOnStatusInsertSchema>;
