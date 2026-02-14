import { z } from 'zod';

export const SalesForecastItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  uom: z.string().optional(),
  delivery_date: z.string().optional(),
  forecast_qty: z.number().optional(),
  adjust_qty: z.number().optional(),
  demand_qty: z.number(),
  warehouse: z.string().optional(),
});

export type SalesForecastItem = z.infer<typeof SalesForecastItemSchema>;

export const SalesForecastItemInsertSchema = SalesForecastItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesForecastItemInsert = z.infer<typeof SalesForecastItemInsertSchema>;
