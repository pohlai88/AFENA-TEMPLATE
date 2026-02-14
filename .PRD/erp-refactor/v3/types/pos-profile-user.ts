import { z } from 'zod';

export const PosProfileUserSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  default: z.boolean().optional().default(false),
  user: z.string().optional(),
});

export type PosProfileUser = z.infer<typeof PosProfileUserSchema>;

export const PosProfileUserInsertSchema = PosProfileUserSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosProfileUserInsert = z.infer<typeof PosProfileUserInsertSchema>;
