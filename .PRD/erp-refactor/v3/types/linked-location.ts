import { z } from 'zod';

export const LinkedLocationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  location: z.string(),
});

export type LinkedLocation = z.infer<typeof LinkedLocationSchema>;

export const LinkedLocationInsertSchema = LinkedLocationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LinkedLocationInsert = z.infer<typeof LinkedLocationInsertSchema>;
