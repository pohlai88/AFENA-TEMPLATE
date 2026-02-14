import { z } from 'zod';

export const SupplierGroupItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  supplier_group: z.string().optional(),
});

export type SupplierGroupItem = z.infer<typeof SupplierGroupItemSchema>;

export const SupplierGroupItemInsertSchema = SupplierGroupItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierGroupItemInsert = z.infer<typeof SupplierGroupItemInsertSchema>;
