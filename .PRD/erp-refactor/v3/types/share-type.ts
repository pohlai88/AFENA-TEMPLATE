import { z } from 'zod';

export const ShareTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
});

export type ShareType = z.infer<typeof ShareTypeSchema>;

export const ShareTypeInsertSchema = ShareTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShareTypeInsert = z.infer<typeof ShareTypeInsertSchema>;
