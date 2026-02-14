import { z } from 'zod';

export const BlanketOrderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MFG-BLR-.YYYY.-']),
  blanket_order_type: z.enum(['Selling', 'Purchasing']),
  customer: z.string().optional(),
  customer_name: z.string().optional(),
  supplier: z.string().optional(),
  supplier_name: z.string().optional(),
  order_no: z.string().optional(),
  order_date: z.string().optional(),
  from_date: z.string(),
  to_date: z.string(),
  company: z.string(),
  items: z.array(z.unknown()),
  amended_from: z.string().optional(),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
});

export type BlanketOrder = z.infer<typeof BlanketOrderSchema>;

export const BlanketOrderInsertSchema = BlanketOrderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BlanketOrderInsert = z.infer<typeof BlanketOrderInsertSchema>;
