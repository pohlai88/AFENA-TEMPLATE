import { z } from 'zod';

export const CustomerGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  customer_group_name: z.string(),
  parent_customer_group: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  default_price_list: z.string().optional(),
  payment_terms: z.string().optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
  accounts: z.array(z.unknown()).optional(),
  credit_limits: z.array(z.unknown()).optional(),
});

export type CustomerGroup = z.infer<typeof CustomerGroupSchema>;

export const CustomerGroupInsertSchema = CustomerGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CustomerGroupInsert = z.infer<typeof CustomerGroupInsertSchema>;
