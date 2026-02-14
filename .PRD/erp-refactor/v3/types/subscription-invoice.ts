import { z } from 'zod';

export const SubscriptionInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  document_type: z.string().optional(),
  invoice: z.string().optional(),
});

export type SubscriptionInvoice = z.infer<typeof SubscriptionInvoiceSchema>;

export const SubscriptionInvoiceInsertSchema = SubscriptionInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubscriptionInvoiceInsert = z.infer<typeof SubscriptionInvoiceInsertSchema>;
