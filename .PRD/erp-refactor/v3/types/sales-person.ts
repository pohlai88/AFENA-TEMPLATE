import { z } from 'zod';

export const SalesPersonSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_person_name: z.string(),
  parent_sales_person: z.string().optional(),
  commission_rate: z.string().optional(),
  is_group: z.boolean().default(false),
  enabled: z.boolean().optional().default(true),
  employee: z.string().optional(),
  department: z.string().optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
  targets: z.array(z.unknown()).optional(),
});

export type SalesPerson = z.infer<typeof SalesPersonSchema>;

export const SalesPersonInsertSchema = SalesPersonSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesPersonInsert = z.infer<typeof SalesPersonInsertSchema>;
