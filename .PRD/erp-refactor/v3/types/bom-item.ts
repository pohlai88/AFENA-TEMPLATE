import { z } from 'zod';

export const BomItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  operation: z.string().optional(),
  operation_row_id: z.number().int().optional(),
  do_not_explode: z.boolean().optional().default(false),
  bom_no: z.string().optional(),
  source_warehouse: z.string().optional(),
  allow_alternative_item: z.boolean().optional().default(false),
  is_stock_item: z.boolean().optional().default(false),
  description: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  qty: z.number(),
  uom: z.string(),
  stock_qty: z.number().optional(),
  stock_uom: z.string().optional(),
  conversion_factor: z.number().optional(),
  rate: z.number(),
  base_rate: z.number().optional(),
  amount: z.number().optional(),
  base_amount: z.number().optional(),
  qty_consumed_per_unit: z.number().optional(),
  has_variants: z.boolean().optional().default(false),
  include_item_in_manufacturing: z.boolean().optional().default(false),
  original_item: z.string().optional(),
  sourced_by_supplier: z.boolean().optional().default(false),
  is_sub_assembly_item: z.boolean().optional().default(false),
  is_phantom_item: z.boolean().optional().default(false),
});

export type BomItem = z.infer<typeof BomItemSchema>;

export const BomItemInsertSchema = BomItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomItemInsert = z.infer<typeof BomItemInsertSchema>;
