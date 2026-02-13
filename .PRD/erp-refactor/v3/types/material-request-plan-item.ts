import { z } from 'zod';

export const MaterialRequestPlanItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  from_warehouse: z.string().optional(),
  warehouse: z.string(),
  material_request_type: z.enum(['Purchase', 'Material Transfer', 'Material Issue', 'Manufacture', 'Subcontracting', 'Customer Provided']).optional(),
  item_name: z.string().optional(),
  uom: z.string().optional(),
  conversion_factor: z.number().optional(),
  from_bom: z.string().optional(),
  main_item_code: z.string().optional(),
  required_bom_qty: z.number().optional(),
  projected_qty: z.number().optional(),
  quantity: z.number(),
  stock_reserved_qty: z.number().optional(),
  schedule_date: z.string().optional(),
  description: z.string().optional(),
  min_order_qty: z.number().optional(),
  sales_order: z.string().optional(),
  sub_assembly_item_reference: z.string().optional(),
  actual_qty: z.number().optional().default(0),
  requested_qty: z.number().optional().default(0),
  reserved_qty_for_production: z.number().optional(),
  ordered_qty: z.number().optional(),
  safety_stock: z.number().optional(),
});

export type MaterialRequestPlanItem = z.infer<typeof MaterialRequestPlanItemSchema>;

export const MaterialRequestPlanItemInsertSchema = MaterialRequestPlanItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaterialRequestPlanItemInsert = z.infer<typeof MaterialRequestPlanItemInsertSchema>;
