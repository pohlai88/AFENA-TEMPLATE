import { z } from 'zod';

export const SalesPartnerItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_partner: z.string().optional(),
});

export type SalesPartnerItem = z.infer<typeof SalesPartnerItemSchema>;

export const SalesPartnerItemInsertSchema = SalesPartnerItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesPartnerItemInsert = z.infer<typeof SalesPartnerItemInsertSchema>;
