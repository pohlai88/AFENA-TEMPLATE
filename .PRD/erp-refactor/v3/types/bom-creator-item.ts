import { z } from 'zod';

export const BomCreatorItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  item_group: z.string().optional(),
  fg_item: z.string(),
  is_expandable: z.boolean().optional().default(false),
  sourced_by_supplier: z.boolean().optional().default(false),
  bom_created: z.boolean().optional().default(false),
  is_subcontracted: z.boolean().optional().default(false),
  is_phantom_item: z.boolean().optional().default(false),
  operation: z.string().optional(),
  description: z.string().optional(),
  qty: z.number().optional(),
  rate: z.number().optional(),
  uom: z.string().optional(),
  stock_qty: z.number().optional(),
  conversion_factor: z.number().optional(),
  stock_uom: z.string().optional(),
  amount: z.number().optional(),
  base_rate: z.number().optional(),
  base_amount: z.number().optional(),
  do_not_explode: z.boolean().optional().default(true),
  parent_row_no: z.string().optional(),
  fg_reference_id: z.string().optional(),
  instruction: z.string().optional(),
});

export type BomCreatorItem = z.infer<typeof BomCreatorItemSchema>;

export const BomCreatorItemInsertSchema = BomCreatorItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomCreatorItemInsert = z.infer<typeof BomCreatorItemInsertSchema>;
