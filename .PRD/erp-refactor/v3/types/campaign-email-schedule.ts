import { z } from 'zod';

export const CampaignEmailScheduleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  email_template: z.string(),
  send_after_days: z.number().int(),
});

export type CampaignEmailSchedule = z.infer<typeof CampaignEmailScheduleSchema>;

export const CampaignEmailScheduleInsertSchema = CampaignEmailScheduleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CampaignEmailScheduleInsert = z.infer<typeof CampaignEmailScheduleInsertSchema>;
