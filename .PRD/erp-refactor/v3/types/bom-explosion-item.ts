import { z } from 'zod';

export const BomExplosionItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  source_warehouse: z.string().optional(),
  operation: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  stock_qty: z.number().optional(),
  rate: z.number().optional(),
  qty_consumed_per_unit: z.number().optional(),
  stock_uom: z.string().optional(),
  amount: z.number().optional(),
  include_item_in_manufacturing: z.boolean().optional().default(false),
  sourced_by_supplier: z.boolean().optional().default(false),
  is_sub_assembly_item: z.boolean().optional().default(false),
});

export type BomExplosionItem = z.infer<typeof BomExplosionItemSchema>;

export const BomExplosionItemInsertSchema = BomExplosionItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomExplosionItemInsert = z.infer<typeof BomExplosionItemInsertSchema>;
