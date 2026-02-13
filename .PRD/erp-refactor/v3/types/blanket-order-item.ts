import { z } from 'zod';

export const BlanketOrderItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  party_item_code: z.string().optional(),
  qty: z.number().optional(),
  rate: z.number(),
  ordered_qty: z.number().optional(),
  terms_and_conditions: z.string().optional(),
});

export type BlanketOrderItem = z.infer<typeof BlanketOrderItemSchema>;

export const BlanketOrderItemInsertSchema = BlanketOrderItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BlanketOrderItemInsert = z.infer<typeof BlanketOrderItemInsertSchema>;
