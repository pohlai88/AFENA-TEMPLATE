import { z } from 'zod';

export const LandedCostVendorInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  vendor_invoice: z.string().optional(),
  amount: z.number().optional(),
});

export type LandedCostVendorInvoice = z.infer<typeof LandedCostVendorInvoiceSchema>;

export const LandedCostVendorInvoiceInsertSchema = LandedCostVendorInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LandedCostVendorInvoiceInsert = z.infer<typeof LandedCostVendorInvoiceInsertSchema>;
