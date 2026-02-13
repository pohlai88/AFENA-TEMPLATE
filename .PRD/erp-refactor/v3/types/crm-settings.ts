import { z } from 'zod';

export const CrmSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  campaign_naming_by: z.enum(['Campaign Name', 'Naming Series']).optional(),
  allow_lead_duplication_based_on_emails: z.boolean().optional().default(false),
  auto_creation_of_contact: z.boolean().optional().default(true),
  close_opportunity_after_days: z.number().int().optional().default(15),
  default_valid_till: z.string().optional(),
  carry_forward_communication_and_comments: z.boolean().optional().default(false),
  update_timestamp_on_new_communication: z.boolean().optional().default(false),
});

export type CrmSettings = z.infer<typeof CrmSettingsSchema>;

export const CrmSettingsInsertSchema = CrmSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CrmSettingsInsert = z.infer<typeof CrmSettingsInsertSchema>;
