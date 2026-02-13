import { z } from 'zod';

export const AccountCategorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account_category_name: z.string(),
  description: z.string().optional(),
});

export type AccountCategory = z.infer<typeof AccountCategorySchema>;

export const AccountCategoryInsertSchema = AccountCategorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountCategoryInsert = z.infer<typeof AccountCategoryInsertSchema>;
