import { z } from 'zod';

export const BranchSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  branch: z.string(),
});

export type Branch = z.infer<typeof BranchSchema>;

export const BranchInsertSchema = BranchSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BranchInsert = z.infer<typeof BranchInsertSchema>;
