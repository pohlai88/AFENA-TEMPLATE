import { z } from 'zod';

export const SalesPartnerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  partner_name: z.string(),
  partner_type: z.string().optional(),
  territory: z.string(),
  commission_rate: z.number(),
  address_desc: z.string().optional(),
  address_html: z.string().optional(),
  contact_desc: z.string().optional(),
  contact_html: z.string().optional(),
  targets: z.array(z.unknown()).optional(),
  show_in_website: z.boolean().optional().default(false),
  referral_code: z.string().max(8).optional(),
  route: z.string().optional(),
  logo: z.string().optional(),
  partner_website: z.string().optional(),
  introduction: z.string().optional(),
  description: z.string().optional(),
});

export type SalesPartner = z.infer<typeof SalesPartnerSchema>;

export const SalesPartnerInsertSchema = SalesPartnerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesPartnerInsert = z.infer<typeof SalesPartnerInsertSchema>;
