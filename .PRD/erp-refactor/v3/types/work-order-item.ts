import { z } from 'zod';

export const WorkOrderItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  operation: z.string().optional(),
  item_code: z.string().optional(),
  source_warehouse: z.string().optional(),
  operation_row_id: z.number().int().optional(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  allow_alternative_item: z.boolean().optional().default(false),
  include_item_in_manufacturing: z.boolean().optional().default(false),
  required_qty: z.number().optional(),
  stock_uom: z.string().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  transferred_qty: z.number().optional(),
  consumed_qty: z.number().optional(),
  returned_qty: z.number().optional(),
  available_qty_at_source_warehouse: z.number().optional(),
  available_qty_at_wip_warehouse: z.number().optional(),
  stock_reserved_qty: z.number().optional(),
  is_additional_item: z.boolean().optional().default(false),
  is_customer_provided_item: z.boolean().optional().default(false),
  voucher_detail_reference: z.string().optional(),
});

export type WorkOrderItem = z.infer<typeof WorkOrderItemSchema>;

export const WorkOrderItemInsertSchema = WorkOrderItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkOrderItemInsert = z.infer<typeof WorkOrderItemInsertSchema>;
