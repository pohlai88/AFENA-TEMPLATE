import { z } from 'zod';

export const CrmNoteSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  note: z.string().optional(),
  added_by: z.string().optional(),
  added_on: z.string().optional(),
});

export type CrmNote = z.infer<typeof CrmNoteSchema>;

export const CrmNoteInsertSchema = CrmNoteSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CrmNoteInsert = z.infer<typeof CrmNoteInsertSchema>;
