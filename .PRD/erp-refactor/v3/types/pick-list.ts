import { z } from 'zod';

export const PickListSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['STO-PICK-.YYYY.-']),
  company: z.string(),
  purpose: z.enum(['Material Transfer for Manufacture', 'Material Transfer', 'Delivery']).optional().default('Material Transfer for Manufacture'),
  customer: z.string().optional(),
  customer_name: z.string().optional(),
  work_order: z.string().optional(),
  material_request: z.string().optional(),
  for_qty: z.number().optional(),
  parent_warehouse: z.string().optional(),
  consider_rejected_warehouses: z.boolean().optional().default(false),
  pick_manually: z.boolean().optional().default(false),
  ignore_pricing_rule: z.boolean().optional().default(false),
  scan_barcode: z.string().optional(),
  scan_mode: z.boolean().optional().default(false),
  prompt_qty: z.boolean().optional().default(false),
  locations: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
  group_same_items: z.boolean().optional().default(false),
  status: z.enum(['Draft', 'Open', 'Partly Delivered', 'Completed', 'Cancelled']).default('Draft'),
  delivery_status: z.enum(['Not Delivered', 'Fully Delivered', 'Partly Delivered']).optional(),
  per_delivered: z.number().optional(),
});

export type PickList = z.infer<typeof PickListSchema>;

export const PickListInsertSchema = PickListSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PickListInsert = z.infer<typeof PickListInsertSchema>;
