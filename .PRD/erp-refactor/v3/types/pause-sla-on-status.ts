import { z } from 'zod';

export const PauseSlaOnStatusSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  status: z.string(),
});

export type PauseSlaOnStatus = z.infer<typeof PauseSlaOnStatusSchema>;

export const PauseSlaOnStatusInsertSchema = PauseSlaOnStatusSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PauseSlaOnStatusInsert = z.infer<typeof PauseSlaOnStatusInsertSchema>;
