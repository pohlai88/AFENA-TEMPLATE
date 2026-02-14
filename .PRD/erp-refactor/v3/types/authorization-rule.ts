import { z } from 'zod';

export const AuthorizationRuleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  transaction: z.enum(['Sales Order', 'Purchase Order', 'Quotation', 'Delivery Note', 'Sales Invoice', 'Purchase Invoice', 'Purchase Receipt']),
  based_on: z.enum(['Grand Total', 'Average Discount', 'Customerwise Discount', 'Itemwise Discount', 'Item Group wise Discount', 'Not Applicable']),
  customer_or_item: z.enum(['Customer', 'Item', 'Item Group']).optional(),
  master_name: z.string().optional(),
  company: z.string().optional(),
  value: z.number().optional(),
  system_role: z.string().optional(),
  to_emp: z.string().optional(),
  system_user: z.string().optional(),
  to_designation: z.string().optional(),
  approving_role: z.string().optional(),
  approving_user: z.string().optional(),
});

export type AuthorizationRule = z.infer<typeof AuthorizationRuleSchema>;

export const AuthorizationRuleInsertSchema = AuthorizationRuleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AuthorizationRuleInsert = z.infer<typeof AuthorizationRuleInsertSchema>;
