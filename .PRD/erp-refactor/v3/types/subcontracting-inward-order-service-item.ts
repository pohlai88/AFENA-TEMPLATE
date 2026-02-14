import { z } from 'zod';

export const SubcontractingInwardOrderServiceItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string(),
  qty: z.number(),
  uom: z.string(),
  rate: z.number(),
  amount: z.number(),
  fg_item: z.string(),
  fg_item_qty: z.number().default(1),
  sales_order_item: z.string().optional(),
});

export type SubcontractingInwardOrderServiceItem = z.infer<typeof SubcontractingInwardOrderServiceItemSchema>;

export const SubcontractingInwardOrderServiceItemInsertSchema = SubcontractingInwardOrderServiceItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingInwardOrderServiceItemInsert = z.infer<typeof SubcontractingInwardOrderServiceItemInsertSchema>;
