import { z } from 'zod';

export const PickListItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  item_group: z.string().optional(),
  warehouse: z.string().optional(),
  qty: z.number().default(1),
  stock_qty: z.number().optional(),
  picked_qty: z.number().optional(),
  stock_reserved_qty: z.number().optional().default(0),
  uom: z.string().optional(),
  conversion_factor: z.number().optional(),
  stock_uom: z.string().optional(),
  delivered_qty: z.number().optional().default(0),
  actual_qty: z.number().optional(),
  company_total_stock: z.number().optional(),
  serial_and_batch_bundle: z.string().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  sales_order: z.string().optional(),
  sales_order_item: z.string().optional(),
  product_bundle_item: z.string().optional(),
  material_request: z.string().optional(),
  material_request_item: z.string().optional(),
});

export type PickListItem = z.infer<typeof PickListItemSchema>;

export const PickListItemInsertSchema = PickListItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PickListItemInsert = z.infer<typeof PickListItemInsertSchema>;
