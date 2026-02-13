import { z } from 'zod';

export const QuickStockBalanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  warehouse: z.string(),
  date: z.string().default('Today'),
  item_barcode: z.string().optional(),
  item: z.string(),
  item_name: z.string().optional(),
  item_description: z.string().optional().default('  '),
  image: z.string().optional(),
  qty: z.number().optional(),
  value: z.number().optional(),
});

export type QuickStockBalance = z.infer<typeof QuickStockBalanceSchema>;

export const QuickStockBalanceInsertSchema = QuickStockBalanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QuickStockBalanceInsert = z.infer<typeof QuickStockBalanceInsertSchema>;
