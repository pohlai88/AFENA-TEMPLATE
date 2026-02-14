import { z } from 'zod';

export const IndustryTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  industry: z.string(),
});

export type IndustryType = z.infer<typeof IndustryTypeSchema>;

export const IndustryTypeInsertSchema = IndustryTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type IndustryTypeInsert = z.infer<typeof IndustryTypeInsertSchema>;
