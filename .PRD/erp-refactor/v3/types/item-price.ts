import { z } from 'zod';

export const ItemPriceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  uom: z.string(),
  packing_unit: z.number().int().optional().default(0),
  item_name: z.string().optional(),
  brand: z.string().optional(),
  item_description: z.string().optional(),
  price_list: z.string(),
  customer: z.string().optional(),
  supplier: z.string().optional(),
  batch_no: z.string().optional(),
  buying: z.boolean().optional().default(false),
  selling: z.boolean().optional().default(false),
  currency: z.string().optional(),
  price_list_rate: z.number(),
  valid_from: z.string().optional().default('Today'),
  lead_time_days: z.number().int().optional().default(0),
  valid_upto: z.string().optional(),
  note: z.string().optional(),
  reference: z.string().optional(),
});

export type ItemPrice = z.infer<typeof ItemPriceSchema>;

export const ItemPriceInsertSchema = ItemPriceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemPriceInsert = z.infer<typeof ItemPriceInsertSchema>;
