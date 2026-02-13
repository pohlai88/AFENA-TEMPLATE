import { z } from 'zod';

export const PortalUserSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  user: z.string(),
});

export type PortalUser = z.infer<typeof PortalUserSchema>;

export const PortalUserInsertSchema = PortalUserSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PortalUserInsert = z.infer<typeof PortalUserInsertSchema>;
