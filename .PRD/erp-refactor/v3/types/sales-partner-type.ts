import { z } from 'zod';

export const SalesPartnerTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_partner_type: z.string(),
});

export type SalesPartnerType = z.infer<typeof SalesPartnerTypeSchema>;

export const SalesPartnerTypeInsertSchema = SalesPartnerTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesPartnerTypeInsert = z.infer<typeof SalesPartnerTypeInsertSchema>;
