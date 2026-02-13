import { z } from 'zod';

export const CustomerItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  customer: z.string().optional(),
});

export type CustomerItem = z.infer<typeof CustomerItemSchema>;

export const CustomerItemInsertSchema = CustomerItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CustomerItemInsert = z.infer<typeof CustomerItemInsertSchema>;
