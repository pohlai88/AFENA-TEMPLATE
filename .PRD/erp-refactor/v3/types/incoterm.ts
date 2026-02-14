import { z } from 'zod';

export const IncotermSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  code: z.string().max(3),
  title: z.string(),
  description: z.string().optional(),
});

export type Incoterm = z.infer<typeof IncotermSchema>;

export const IncotermInsertSchema = IncotermSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type IncotermInsert = z.infer<typeof IncotermInsertSchema>;
