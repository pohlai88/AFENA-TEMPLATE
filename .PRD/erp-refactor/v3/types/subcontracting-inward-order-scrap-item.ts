import { z } from 'zod';

export const SubcontractingInwardOrderScrapItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  fg_item_code: z.string(),
  stock_uom: z.string(),
  warehouse: z.string(),
  reference_name: z.string(),
  produced_qty: z.number().default(0),
  delivered_qty: z.number().default(0),
});

export type SubcontractingInwardOrderScrapItem = z.infer<typeof SubcontractingInwardOrderScrapItemSchema>;

export const SubcontractingInwardOrderScrapItemInsertSchema = SubcontractingInwardOrderScrapItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingInwardOrderScrapItemInsert = z.infer<typeof SubcontractingInwardOrderScrapItemInsertSchema>;
