import { z } from 'zod';

export const ItemSupplierSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  supplier: z.string(),
  supplier_part_no: z.string().optional(),
});

export type ItemSupplier = z.infer<typeof ItemSupplierSchema>;

export const ItemSupplierInsertSchema = ItemSupplierSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemSupplierInsert = z.infer<typeof ItemSupplierInsertSchema>;
