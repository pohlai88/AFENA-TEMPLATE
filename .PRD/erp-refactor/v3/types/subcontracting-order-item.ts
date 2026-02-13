import { z } from 'zod';

export const SubcontractingOrderItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string(),
  bom: z.string(),
  include_exploded_items: z.boolean().optional().default(false),
  schedule_date: z.string().optional(),
  expected_delivery_date: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  qty: z.number().default(1),
  received_qty: z.number().optional(),
  returned_qty: z.number().optional(),
  stock_uom: z.string(),
  conversion_factor: z.number().optional().default(1),
  rate: z.number(),
  amount: z.number(),
  rm_cost_per_qty: z.number().optional(),
  service_cost_per_qty: z.number(),
  additional_cost_per_qty: z.number().optional().default(0),
  warehouse: z.string(),
  expense_account: z.string().optional(),
  manufacturer: z.string().optional(),
  manufacturer_part_no: z.string().optional(),
  material_request: z.string().optional(),
  material_request_item: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  job_card: z.string().optional(),
  purchase_order_item: z.string().optional(),
  page_break: z.boolean().optional().default(false),
  subcontracting_conversion_factor: z.number().optional(),
  production_plan_sub_assembly_item: z.string().optional(),
});

export type SubcontractingOrderItem = z.infer<typeof SubcontractingOrderItemSchema>;

export const SubcontractingOrderItemInsertSchema = SubcontractingOrderItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingOrderItemInsert = z.infer<typeof SubcontractingOrderItemInsertSchema>;
