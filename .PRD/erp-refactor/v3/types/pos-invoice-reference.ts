import { z } from 'zod';

export const PosInvoiceReferenceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  pos_invoice: z.string(),
  posting_date: z.string(),
  customer: z.string(),
  grand_total: z.number(),
  is_return: z.boolean().optional().default(false),
  return_against: z.string().optional(),
});

export type PosInvoiceReference = z.infer<typeof PosInvoiceReferenceSchema>;

export const PosInvoiceReferenceInsertSchema = PosInvoiceReferenceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosInvoiceReferenceInsert = z.infer<typeof PosInvoiceReferenceInsertSchema>;
