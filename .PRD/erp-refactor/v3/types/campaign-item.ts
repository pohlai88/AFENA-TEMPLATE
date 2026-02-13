import { z } from 'zod';

export const CampaignItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  campaign: z.string().optional(),
});

export type CampaignItem = z.infer<typeof CampaignItemSchema>;

export const CampaignItemInsertSchema = CampaignItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CampaignItemInsert = z.infer<typeof CampaignItemInsertSchema>;
