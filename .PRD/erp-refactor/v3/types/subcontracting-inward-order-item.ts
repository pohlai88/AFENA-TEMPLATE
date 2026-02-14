import { z } from 'zod';

export const SubcontractingInwardOrderItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string(),
  bom: z.string(),
  delivery_warehouse: z.string(),
  include_exploded_items: z.boolean().optional().default(false),
  qty: z.number().default(1),
  produced_qty: z.number().optional().default(0),
  returned_qty: z.number().optional().default(0),
  stock_uom: z.string(),
  process_loss_qty: z.number().optional().default(0),
  delivered_qty: z.number().optional().default(0),
  conversion_factor: z.number().optional().default(1),
  sales_order_item: z.string().optional(),
  subcontracting_conversion_factor: z.number().optional(),
});

export type SubcontractingInwardOrderItem = z.infer<typeof SubcontractingInwardOrderItemSchema>;

export const SubcontractingInwardOrderItemInsertSchema = SubcontractingInwardOrderItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingInwardOrderItemInsert = z.infer<typeof SubcontractingInwardOrderItemInsertSchema>;
