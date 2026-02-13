import { z } from 'zod';

export const SupportSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  track_service_level_agreement: z.boolean().optional().default(false),
  allow_resetting_service_level_agreement: z.boolean().optional().default(false),
  close_issue_after_days: z.number().int().optional().default(7),
  get_started_sections: z.string().optional(),
  show_latest_forum_posts: z.boolean().optional().default(false),
  forum_url: z.string().optional(),
  get_latest_query: z.string().optional(),
  response_key_list: z.string().optional(),
  post_title_key: z.string().optional(),
  post_description_key: z.string().optional(),
  post_route_key: z.string().optional(),
  post_route_string: z.string().optional(),
  greeting_title: z.string().optional().default('We\'re here to help'),
  greeting_subtitle: z.string().optional().default('Browse help topics'),
  search_apis: z.array(z.unknown()).optional(),
});

export type SupportSettings = z.infer<typeof SupportSettingsSchema>;

export const SupportSettingsInsertSchema = SupportSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupportSettingsInsert = z.infer<typeof SupportSettingsInsertSchema>;
