import { z } from 'zod';

export const IssueTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  description: z.string().optional(),
});

export type IssueType = z.infer<typeof IssueTypeSchema>;

export const IssueTypeInsertSchema = IssueTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type IssueTypeInsert = z.infer<typeof IssueTypeInsertSchema>;
