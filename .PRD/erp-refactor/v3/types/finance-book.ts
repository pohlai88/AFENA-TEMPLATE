import { z } from 'zod';

export const FinanceBookSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  finance_book_name: z.string().optional(),
});

export type FinanceBook = z.infer<typeof FinanceBookSchema>;

export const FinanceBookInsertSchema = FinanceBookSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type FinanceBookInsert = z.infer<typeof FinanceBookInsertSchema>;
