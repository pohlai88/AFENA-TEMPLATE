import { z } from 'zod';

export const PackedItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  parent_item: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  warehouse: z.string().optional(),
  target_warehouse: z.string().optional(),
  conversion_factor: z.number().optional(),
  qty: z.number().optional(),
  rate: z.number().optional(),
  uom: z.string().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  serial_and_batch_bundle: z.string().optional(),
  delivered_by_supplier: z.boolean().optional().default(false),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  actual_batch_qty: z.number().optional(),
  actual_qty: z.number().optional(),
  projected_qty: z.number().optional(),
  ordered_qty: z.number().optional(),
  packed_qty: z.number().optional().default(0),
  incoming_rate: z.number().optional(),
  picked_qty: z.number().optional(),
  page_break: z.boolean().optional().default(false),
  prevdoc_doctype: z.string().optional(),
  parent_detail_docname: z.string().optional(),
});

export type PackedItem = z.infer<typeof PackedItemSchema>;

export const PackedItemInsertSchema = PackedItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PackedItemInsert = z.infer<typeof PackedItemInsertSchema>;
