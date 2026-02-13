import { z } from 'zod';

export const EmailCampaignSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  campaign_name: z.string(),
  email_campaign_for: z.enum(['Lead', 'Contact', 'Email Group']).default('Lead'),
  recipient: z.string(),
  sender: z.string().optional().default('__user'),
  start_date: z.string(),
  end_date: z.string().optional(),
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Unsubscribed']).optional(),
});

export type EmailCampaign = z.infer<typeof EmailCampaignSchema>;

export const EmailCampaignInsertSchema = EmailCampaignSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmailCampaignInsert = z.infer<typeof EmailCampaignInsertSchema>;
