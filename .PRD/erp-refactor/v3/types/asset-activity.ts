import { z } from 'zod';

export const AssetActivitySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  asset: z.string(),
  date: z.string().default('now'),
  user: z.string(),
  subject: z.string(),
});

export type AssetActivity = z.infer<typeof AssetActivitySchema>;

export const AssetActivityInsertSchema = AssetActivitySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetActivityInsert = z.infer<typeof AssetActivityInsertSchema>;
