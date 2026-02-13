import { z } from 'zod';

export const StockClosingEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['CBAL-.#####']).optional(),
  company: z.string().optional(),
  status: z.enum(['Draft', 'Queued', 'In Progress', 'Completed', 'Failed', 'Cancelled']).optional().default('Draft'),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  amended_from: z.string().optional(),
});

export type StockClosingEntry = z.infer<typeof StockClosingEntrySchema>;

export const StockClosingEntryInsertSchema = StockClosingEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockClosingEntryInsert = z.infer<typeof StockClosingEntryInsertSchema>;
