import { z } from 'zod';

export const QuotationLostReasonSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  order_lost_reason: z.string(),
});

export type QuotationLostReason = z.infer<typeof QuotationLostReasonSchema>;

export const QuotationLostReasonInsertSchema = QuotationLostReasonSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QuotationLostReasonInsert = z.infer<typeof QuotationLostReasonInsertSchema>;
