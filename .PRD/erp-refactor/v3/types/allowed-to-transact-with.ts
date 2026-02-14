import { z } from 'zod';

export const AllowedToTransactWithSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
});

export type AllowedToTransactWith = z.infer<typeof AllowedToTransactWithSchema>;

export const AllowedToTransactWithInsertSchema = AllowedToTransactWithSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AllowedToTransactWithInsert = z.infer<typeof AllowedToTransactWithInsertSchema>;
