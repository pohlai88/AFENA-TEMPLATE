import { z } from 'zod';

export const BomScrapItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  stock_qty: z.number(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  stock_uom: z.string().optional(),
  base_rate: z.number().optional(),
  base_amount: z.number().optional(),
});

export type BomScrapItem = z.infer<typeof BomScrapItemSchema>;

export const BomScrapItemInsertSchema = BomScrapItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomScrapItemInsert = z.infer<typeof BomScrapItemInsertSchema>;
