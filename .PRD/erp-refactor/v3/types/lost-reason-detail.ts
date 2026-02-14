import { z } from 'zod';

export const LostReasonDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  lost_reason: z.string().optional(),
});

export type LostReasonDetail = z.infer<typeof LostReasonDetailSchema>;

export const LostReasonDetailInsertSchema = LostReasonDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LostReasonDetailInsert = z.infer<typeof LostReasonDetailInsertSchema>;
