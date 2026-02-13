import { z } from 'zod';

export const ProspectSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company_name: z.string().optional(),
  customer_group: z.string().optional(),
  no_of_employees: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).optional(),
  annual_revenue: z.number().optional(),
  market_segment: z.string().optional(),
  industry: z.string().optional(),
  territory: z.string().optional(),
  prospect_owner: z.string().optional(),
  website: z.string().optional(),
  fax: z.string().optional(),
  company: z.string(),
  address_html: z.string().optional(),
  contact_html: z.string().optional(),
  leads: z.array(z.unknown()).optional(),
  opportunities: z.array(z.unknown()).optional(),
  open_activities_html: z.string().optional(),
  all_activities_html: z.string().optional(),
  notes_html: z.string().optional(),
  notes: z.array(z.unknown()).optional(),
});

export type Prospect = z.infer<typeof ProspectSchema>;

export const ProspectInsertSchema = ProspectSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProspectInsert = z.infer<typeof ProspectInsertSchema>;
