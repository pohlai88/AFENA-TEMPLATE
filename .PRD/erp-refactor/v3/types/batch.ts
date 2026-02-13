import { z } from 'zod';

export const BatchSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  use_batchwise_valuation: z.boolean().optional().default(false),
  batch_id: z.string(),
  item: z.string(),
  item_name: z.string().optional(),
  image: z.string().optional(),
  parent_batch: z.string().optional(),
  manufacturing_date: z.string().optional().default('Today'),
  batch_qty: z.number().optional(),
  stock_uom: z.string().optional(),
  expiry_date: z.string().optional(),
  supplier: z.string().optional(),
  reference_doctype: z.string().optional(),
  reference_name: z.string().optional(),
  description: z.string().optional(),
  qty_to_produce: z.number().optional(),
  produced_qty: z.number().optional(),
});

export type Batch = z.infer<typeof BatchSchema>;

export const BatchInsertSchema = BatchSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BatchInsert = z.infer<typeof BatchInsertSchema>;
