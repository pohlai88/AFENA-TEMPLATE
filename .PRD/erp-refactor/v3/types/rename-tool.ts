import { z } from 'zod';

export const RenameToolSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  select_doctype: z.string().optional(),
  file_to_rename: z.string().optional(),
  rename_log: z.string().optional(),
});

export type RenameTool = z.infer<typeof RenameToolSchema>;

export const RenameToolInsertSchema = RenameToolSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RenameToolInsert = z.infer<typeof RenameToolInsertSchema>;
