import { z } from 'zod';

export const PackingSlipItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  batch_no: z.string().optional(),
  description: z.string().optional(),
  qty: z.number(),
  net_weight: z.number().optional(),
  stock_uom: z.string().optional(),
  weight_uom: z.string().optional(),
  page_break: z.boolean().optional().default(false),
  dn_detail: z.string().optional(),
  pi_detail: z.string().optional(),
});

export type PackingSlipItem = z.infer<typeof PackingSlipItemSchema>;

export const PackingSlipItemInsertSchema = PackingSlipItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PackingSlipItemInsert = z.infer<typeof PackingSlipItemInsertSchema>;
