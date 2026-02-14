import { z } from 'zod';

export const ItemCustomerDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  customer_name: z.string().optional(),
  customer_group: z.string().optional(),
  ref_code: z.string(),
});

export type ItemCustomerDetail = z.infer<typeof ItemCustomerDetailSchema>;

export const ItemCustomerDetailInsertSchema = ItemCustomerDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemCustomerDetailInsert = z.infer<typeof ItemCustomerDetailInsertSchema>;
