import { z } from 'zod';

export const ProspectLeadSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  lead: z.string(),
  lead_name: z.string().optional(),
  email: z.string().email().optional(),
  mobile_no: z.string().optional(),
  lead_owner: z.string().optional(),
  status: z.string().optional(),
});

export type ProspectLead = z.infer<typeof ProspectLeadSchema>;

export const ProspectLeadInsertSchema = ProspectLeadSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProspectLeadInsert = z.infer<typeof ProspectLeadInsertSchema>;
