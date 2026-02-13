import { z } from 'zod';

export const ContractFulfilmentChecklistSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  fulfilled: z.boolean().optional().default(false),
  requirement: z.string().optional(),
  notes: z.string().optional(),
  amended_from: z.string().optional(),
});

export type ContractFulfilmentChecklist = z.infer<typeof ContractFulfilmentChecklistSchema>;

export const ContractFulfilmentChecklistInsertSchema = ContractFulfilmentChecklistSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ContractFulfilmentChecklistInsert = z.infer<typeof ContractFulfilmentChecklistInsertSchema>;
