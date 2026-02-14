import { z } from 'zod';

export const StockReconciliationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-RECO-.YYYY.-']),
  company: z.string(),
  purpose: z.enum(['Opening Stock', 'Stock Reconciliation']),
  posting_date: z.string().default('Today'),
  posting_time: z.string().default('Now'),
  set_posting_time: z.boolean().optional().default(false),
  set_warehouse: z.string().optional(),
  scan_barcode: z.string().optional(),
  last_scanned_warehouse: z.string().optional(),
  scan_mode: z.boolean().optional().default(false),
  items: z.array(z.unknown()),
  expense_account: z.string().optional(),
  difference_amount: z.number().optional(),
  amended_from: z.string().optional(),
  cost_center: z.string().optional(),
});

export type StockReconciliation = z.infer<typeof StockReconciliationSchema>;

export const StockReconciliationInsertSchema = StockReconciliationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockReconciliationInsert = z.infer<typeof StockReconciliationInsertSchema>;
