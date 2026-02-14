import { z } from 'zod';

export const SupplierItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  supplier: z.string().optional(),
});

export type SupplierItem = z.infer<typeof SupplierItemSchema>;

export const SupplierItemInsertSchema = SupplierItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierItemInsert = z.infer<typeof SupplierItemInsertSchema>;
