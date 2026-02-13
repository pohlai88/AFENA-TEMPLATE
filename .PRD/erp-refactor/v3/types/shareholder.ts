import { z } from 'zod';

export const ShareholderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  naming_series: z.enum(['ACC-SH-.YYYY.-']).optional(),
  folio_no: z.string().optional(),
  company: z.string(),
  is_company: z.boolean().optional().default(false),
  address_html: z.string().optional(),
  contact_html: z.string().optional(),
  share_balance: z.array(z.unknown()).optional(),
  contact_list: z.string().optional(),
});

export type Shareholder = z.infer<typeof ShareholderSchema>;

export const ShareholderInsertSchema = ShareholderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShareholderInsert = z.infer<typeof ShareholderInsertSchema>;
