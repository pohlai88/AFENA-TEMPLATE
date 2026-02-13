import { z } from 'zod';

export const ProductionPlanSubAssemblyItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  production_item: z.string().optional(),
  item_name: z.string().optional(),
  fg_warehouse: z.string().optional(),
  parent_item_code: z.string().optional(),
  bom_no: z.string().optional(),
  bom_level: z.number().int().optional(),
  type_of_manufacturing: z.enum(['In House', 'Subcontract', 'Material Request']).optional().default('In House'),
  required_qty: z.number().optional(),
  projected_qty: z.number().optional(),
  qty: z.number().optional(),
  supplier: z.string().optional(),
  purchase_order: z.string().optional(),
  production_plan_item: z.string().optional(),
  wo_produced_qty: z.number().optional(),
  stock_reserved_qty: z.number().optional(),
  ordered_qty: z.number().optional(),
  received_qty: z.number().optional(),
  indent: z.number().int().optional(),
  schedule_date: z.string().optional(),
  uom: z.string().optional(),
  stock_uom: z.string().optional(),
  actual_qty: z.number().optional(),
  description: z.string().optional(),
});

export type ProductionPlanSubAssemblyItem = z.infer<typeof ProductionPlanSubAssemblyItemSchema>;

export const ProductionPlanSubAssemblyItemInsertSchema = ProductionPlanSubAssemblyItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductionPlanSubAssemblyItemInsert = z.infer<typeof ProductionPlanSubAssemblyItemInsertSchema>;
