import { z } from 'zod';

export const DeliveryScheduleItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  warehouse: z.string().optional(),
  delivery_date: z.string().optional(),
  sales_order: z.string().optional(),
  sales_order_item: z.string().optional(),
  qty: z.number().optional(),
  uom: z.string().optional(),
  conversion_factor: z.number().optional(),
  stock_qty: z.number().optional(),
  stock_uom: z.string().optional(),
});

export type DeliveryScheduleItem = z.infer<typeof DeliveryScheduleItemSchema>;

export const DeliveryScheduleItemInsertSchema = DeliveryScheduleItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DeliveryScheduleItemInsert = z.infer<typeof DeliveryScheduleItemInsertSchema>;
