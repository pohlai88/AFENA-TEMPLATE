import { z } from 'zod';

export const StockClosingBalanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  warehouse: z.string().optional(),
  batch_no: z.string().optional(),
  posting_date: z.string().optional(),
  posting_time: z.string().optional(),
  posting_datetime: z.string().optional(),
  actual_qty: z.number().optional(),
  valuation_rate: z.number().optional(),
  stock_value: z.number().optional(),
  stock_value_difference: z.number().optional(),
  company: z.string().optional(),
  stock_closing_entry: z.string().optional(),
  item_name: z.string().optional(),
  item_group: z.string().optional(),
  stock_uom: z.string().optional(),
  inventory_dimension_key: z.string().optional(),
  fifo_queue: z.string().optional(),
});

export type StockClosingBalance = z.infer<typeof StockClosingBalanceSchema>;

export const StockClosingBalanceInsertSchema = StockClosingBalanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockClosingBalanceInsert = z.infer<typeof StockClosingBalanceInsertSchema>;
