import { z } from 'zod';

export const RepostAllowedTypesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  document_type: z.string().optional(),
  allowed: z.boolean().optional().default(false),
});

export type RepostAllowedTypes = z.infer<typeof RepostAllowedTypesSchema>;

export const RepostAllowedTypesInsertSchema = RepostAllowedTypesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RepostAllowedTypesInsert = z.infer<typeof RepostAllowedTypesInsertSchema>;
