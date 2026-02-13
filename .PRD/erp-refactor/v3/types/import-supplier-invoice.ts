import { z } from 'zod';

export const ImportSupplierInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  invoice_series: z.enum(['ACC-PINV-.YYYY.-']),
  company: z.string(),
  item_code: z.string(),
  supplier_group: z.string(),
  tax_account: z.string(),
  default_buying_price_list: z.string(),
  zip_file: z.string().optional(),
  status: z.string().optional(),
});

export type ImportSupplierInvoice = z.infer<typeof ImportSupplierInvoiceSchema>;

export const ImportSupplierInvoiceInsertSchema = ImportSupplierInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ImportSupplierInvoiceInsert = z.infer<typeof ImportSupplierInvoiceInsertSchema>;
