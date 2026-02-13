import { z } from 'zod';

export const ItemAlternativeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  alternative_item_code: z.string().optional(),
  two_way: z.boolean().optional().default(false),
  item_name: z.string().optional(),
  alternative_item_name: z.string().optional(),
});

export type ItemAlternative = z.infer<typeof ItemAlternativeSchema>;

export const ItemAlternativeInsertSchema = ItemAlternativeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemAlternativeInsert = z.infer<typeof ItemAlternativeInsertSchema>;
