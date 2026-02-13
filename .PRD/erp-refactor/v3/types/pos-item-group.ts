import { z } from 'zod';

export const PosItemGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_group: z.string(),
});

export type PosItemGroup = z.infer<typeof PosItemGroupSchema>;

export const PosItemGroupInsertSchema = PosItemGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosItemGroupInsert = z.infer<typeof PosItemGroupInsertSchema>;
