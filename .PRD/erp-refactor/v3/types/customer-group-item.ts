import { z } from 'zod';

export const CustomerGroupItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  customer_group: z.string().optional(),
});

export type CustomerGroupItem = z.infer<typeof CustomerGroupItemSchema>;

export const CustomerGroupItemInsertSchema = CustomerGroupItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CustomerGroupItemInsert = z.infer<typeof CustomerGroupItemInsertSchema>;
