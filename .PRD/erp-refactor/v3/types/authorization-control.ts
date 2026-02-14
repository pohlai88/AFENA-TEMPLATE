import { z } from 'zod';

export const AuthorizationControlSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
});

export type AuthorizationControl = z.infer<typeof AuthorizationControlSchema>;

export const AuthorizationControlInsertSchema = AuthorizationControlSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AuthorizationControlInsert = z.infer<typeof AuthorizationControlInsertSchema>;
