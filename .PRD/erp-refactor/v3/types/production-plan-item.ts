import { z } from 'zod';

export const ProductionPlanItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  include_exploded_items: z.boolean().optional().default(true),
  item_code: z.string(),
  bom_no: z.string(),
  planned_qty: z.number(),
  stock_uom: z.string(),
  warehouse: z.string().optional(),
  planned_start_date: z.string().default('Today'),
  pending_qty: z.number().optional().default(0),
  ordered_qty: z.number().optional().default(0),
  description: z.string().optional(),
  produced_qty: z.number().optional().default(0),
  sales_order: z.string().optional(),
  sales_order_item: z.string().optional(),
  material_request: z.string().optional(),
  material_request_item: z.string().optional(),
  product_bundle_item: z.string().optional(),
  item_reference: z.string().optional(),
  temporary_name: z.string().optional(),
});

export type ProductionPlanItem = z.infer<typeof ProductionPlanItemSchema>;

export const ProductionPlanItemInsertSchema = ProductionPlanItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductionPlanItemInsert = z.infer<typeof ProductionPlanItemInsertSchema>;
