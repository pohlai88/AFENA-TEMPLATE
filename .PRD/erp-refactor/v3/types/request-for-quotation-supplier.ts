import { z } from 'zod';

export const RequestForQuotationSupplierSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  supplier: z.string(),
  contact: z.string().optional(),
  quote_status: z.enum(['Pending', 'Received']).optional(),
  supplier_name: z.string().optional(),
  email_id: z.string().optional(),
  send_email: z.boolean().optional().default(true),
  email_sent: z.boolean().optional().default(false),
});

export type RequestForQuotationSupplier = z.infer<typeof RequestForQuotationSupplierSchema>;

export const RequestForQuotationSupplierInsertSchema = RequestForQuotationSupplierSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RequestForQuotationSupplierInsert = z.infer<typeof RequestForQuotationSupplierInsertSchema>;
