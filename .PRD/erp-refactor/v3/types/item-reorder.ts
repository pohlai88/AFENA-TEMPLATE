import { z } from 'zod';

export const ItemReorderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  warehouse: z.string(),
  warehouse_group: z.string().optional(),
  warehouse_reorder_level: z.number().optional(),
  warehouse_reorder_qty: z.number().optional(),
  material_request_type: z.enum(['Purchase', 'Transfer', 'Material Issue', 'Manufacture']),
});

export type ItemReorder = z.infer<typeof ItemReorderSchema>;

export const ItemReorderInsertSchema = ItemReorderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemReorderInsert = z.infer<typeof ItemReorderInsertSchema>;
