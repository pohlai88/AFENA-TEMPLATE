import { z } from 'zod';

export const VideoSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  enable_youtube_tracking: z.boolean().optional().default(false),
  api_key: z.string().optional(),
  frequency: z.enum(['30 mins', '1 hr', '6 hrs', 'Daily']).optional().default('1 hr'),
});

export type VideoSettings = z.infer<typeof VideoSettingsSchema>;

export const VideoSettingsInsertSchema = VideoSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type VideoSettingsInsert = z.infer<typeof VideoSettingsInsertSchema>;
