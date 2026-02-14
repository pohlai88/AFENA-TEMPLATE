import { z } from 'zod';

export const OpeningInvoiceCreationToolSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  create_missing_party: z.boolean().optional().default(false),
  invoice_type: z.enum(['Sales', 'Purchase']),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  invoices: z.array(z.unknown()),
});

export type OpeningInvoiceCreationTool = z.infer<typeof OpeningInvoiceCreationToolSchema>;

export const OpeningInvoiceCreationToolInsertSchema = OpeningInvoiceCreationToolSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OpeningInvoiceCreationToolInsert = z.infer<typeof OpeningInvoiceCreationToolInsertSchema>;
