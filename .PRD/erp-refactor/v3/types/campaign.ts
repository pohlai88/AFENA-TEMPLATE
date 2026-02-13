import { z } from 'zod';

export const CampaignSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  campaign_name: z.string(),
  naming_series: z.enum(['SAL-CAM-.YYYY.-']).optional(),
  campaign_schedules: z.array(z.unknown()).optional(),
  description: z.string().optional(),
});

export type Campaign = z.infer<typeof CampaignSchema>;

export const CampaignInsertSchema = CampaignSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CampaignInsert = z.infer<typeof CampaignInsertSchema>;
