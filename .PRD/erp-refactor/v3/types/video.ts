import { z } from 'zod';

export const VideoSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  provider: z.enum(['YouTube', 'Vimeo']),
  url: z.string(),
  youtube_video_id: z.string().optional(),
  publish_date: z.string().optional(),
  duration: z.number().optional(),
  like_count: z.number().optional(),
  view_count: z.number().optional(),
  dislike_count: z.number().optional(),
  comment_count: z.number().optional(),
  description: z.string(),
  image: z.string().optional(),
});

export type Video = z.infer<typeof VideoSchema>;

export const VideoInsertSchema = VideoSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type VideoInsert = z.infer<typeof VideoInsertSchema>;
