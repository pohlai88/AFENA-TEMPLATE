import { z } from 'zod';

export const SupplierGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  supplier_group_name: z.string(),
  parent_supplier_group: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  payment_terms: z.string().optional(),
  accounts: z.array(z.unknown()).optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
});

export type SupplierGroup = z.infer<typeof SupplierGroupSchema>;

export const SupplierGroupInsertSchema = SupplierGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierGroupInsert = z.infer<typeof SupplierGroupInsertSchema>;
