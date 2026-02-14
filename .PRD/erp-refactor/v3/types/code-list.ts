import { z } from 'zod';

export const CodeListSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string().optional(),
  canonical_uri: z.string().optional(),
  url: z.string().optional(),
  default_common_code: z.string().optional(),
  version: z.string().optional(),
  publisher: z.string().optional(),
  publisher_id: z.string().optional(),
  description: z.string().optional(),
});

export type CodeList = z.infer<typeof CodeListSchema>;

export const CodeListInsertSchema = CodeListSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CodeListInsert = z.infer<typeof CodeListInsertSchema>;
