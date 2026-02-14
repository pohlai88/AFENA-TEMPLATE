import { z } from 'zod';

export const OpeningInvoiceCreationToolItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  invoice_number: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string(),
  temporary_opening_account: z.string().optional(),
  posting_date: z.string().optional().default('Today'),
  due_date: z.string().optional().default('Today'),
  supplier_invoice_date: z.string().optional(),
  item_name: z.string().optional().default('Opening Invoice Item'),
  outstanding_amount: z.number().default(0),
  qty: z.string().optional().default('1'),
  cost_center: z.string().optional(),
});

export type OpeningInvoiceCreationToolItem = z.infer<typeof OpeningInvoiceCreationToolItemSchema>;

export const OpeningInvoiceCreationToolItemInsertSchema = OpeningInvoiceCreationToolItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OpeningInvoiceCreationToolItemInsert = z.infer<typeof OpeningInvoiceCreationToolItemInsertSchema>;
