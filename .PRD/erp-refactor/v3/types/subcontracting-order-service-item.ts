import { z } from 'zod';

export const SubcontractingOrderServiceItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string(),
  qty: z.number(),
  rate: z.number(),
  amount: z.number(),
  fg_item: z.string(),
  fg_item_qty: z.number().default(1),
  purchase_order_item: z.string().optional(),
  material_request: z.string().optional(),
  material_request_item: z.string().optional(),
});

export type SubcontractingOrderServiceItem = z.infer<typeof SubcontractingOrderServiceItemSchema>;

export const SubcontractingOrderServiceItemInsertSchema = SubcontractingOrderServiceItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingOrderServiceItemInsert = z.infer<typeof SubcontractingOrderServiceItemInsertSchema>;
