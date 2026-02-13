import { z } from 'zod';

export const ApplicableOnAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  applicable_on_account: z.string(),
  is_mandatory: z.boolean().optional().default(false),
});

export type ApplicableOnAccount = z.infer<typeof ApplicableOnAccountSchema>;

export const ApplicableOnAccountInsertSchema = ApplicableOnAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ApplicableOnAccountInsert = z.infer<typeof ApplicableOnAccountInsertSchema>;
