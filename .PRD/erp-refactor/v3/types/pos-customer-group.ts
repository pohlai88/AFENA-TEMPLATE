import { z } from 'zod';

export const PosCustomerGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  customer_group: z.string(),
});

export type PosCustomerGroup = z.infer<typeof PosCustomerGroupSchema>;

export const PosCustomerGroupInsertSchema = PosCustomerGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosCustomerGroupInsert = z.infer<typeof PosCustomerGroupInsertSchema>;
