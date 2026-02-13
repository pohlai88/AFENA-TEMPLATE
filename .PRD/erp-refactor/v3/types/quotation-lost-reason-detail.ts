import { z } from 'zod';

export const QuotationLostReasonDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  lost_reason: z.string().optional(),
});

export type QuotationLostReasonDetail = z.infer<typeof QuotationLostReasonDetailSchema>;

export const QuotationLostReasonDetailInsertSchema = QuotationLostReasonDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QuotationLostReasonDetailInsert = z.infer<typeof QuotationLostReasonDetailInsertSchema>;
