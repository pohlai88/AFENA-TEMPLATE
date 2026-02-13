import { z } from 'zod';

export const CommonCodeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  code_list: z.string(),
  canonical_uri: z.string().optional(),
  title: z.string().max(300),
  common_code: z.string().max(300),
  description: z.string().optional(),
  additional_data: z.string().optional(),
  applies_to: z.array(z.unknown()).optional(),
});

export type CommonCode = z.infer<typeof CommonCodeSchema>;

export const CommonCodeInsertSchema = CommonCodeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CommonCodeInsert = z.infer<typeof CommonCodeInsertSchema>;
