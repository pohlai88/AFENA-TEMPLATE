import { z } from 'zod';

export const BomCreatorSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  bom_creator: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  item_group: z.string().optional(),
  qty: z.number(),
  project: z.string().optional(),
  uom: z.string().optional(),
  routing: z.string().optional(),
  rm_cost_as_per: z.enum(['Valuation Rate', 'Last Purchase Rate', 'Price List']).default('Valuation Rate'),
  set_rate_based_on_warehouse: z.boolean().optional().default(false),
  buying_price_list: z.string().optional(),
  price_list_currency: z.string().optional(),
  plc_conversion_rate: z.number().optional(),
  currency: z.string(),
  conversion_rate: z.number().optional().default(1),
  default_warehouse: z.string().optional(),
  company: z.string(),
  items: z.array(z.unknown()).optional(),
  raw_material_cost: z.number().optional(),
  remarks: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'In Progress', 'Completed', 'Failed', 'Cancelled']).optional().default('Draft'),
  error_log: z.string().optional(),
  amended_from: z.string().optional(),
});

export type BomCreator = z.infer<typeof BomCreatorSchema>;

export const BomCreatorInsertSchema = BomCreatorSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomCreatorInsert = z.infer<typeof BomCreatorInsertSchema>;
