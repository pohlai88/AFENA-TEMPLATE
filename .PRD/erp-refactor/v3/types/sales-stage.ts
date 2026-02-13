import { z } from 'zod';

export const SalesStageSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  stage_name: z.string().optional(),
});

export type SalesStage = z.infer<typeof SalesStageSchema>;

export const SalesStageInsertSchema = SalesStageSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesStageInsert = z.infer<typeof SalesStageInsertSchema>;
