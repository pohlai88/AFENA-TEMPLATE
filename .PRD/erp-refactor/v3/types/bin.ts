import { z } from 'zod';

export const BinSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  warehouse: z.string(),
  actual_qty: z.number().optional().default(0),
  planned_qty: z.number().optional(),
  indented_qty: z.number().optional().default(0),
  ordered_qty: z.number().optional().default(0),
  reserved_qty: z.number().optional().default(0),
  reserved_qty_for_production: z.number().optional(),
  reserved_qty_for_sub_contract: z.number().optional(),
  reserved_qty_for_production_plan: z.number().optional(),
  projected_qty: z.number().optional(),
  reserved_stock: z.number().optional().default(0),
  stock_uom: z.string().optional(),
  company: z.string().optional(),
  valuation_rate: z.number().optional(),
  stock_value: z.number().optional(),
});

export type Bin = z.infer<typeof BinSchema>;

export const BinInsertSchema = BinSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BinInsert = z.infer<typeof BinInsertSchema>;
