import { z } from 'zod';

export const SupportSearchSourceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  source_name: z.string().optional(),
  source_type: z.enum(['API', 'Link']),
  base_url: z.string().optional(),
  query_route: z.string().optional(),
  search_term_param_name: z.string().optional(),
  response_result_key_path: z.string().optional(),
  post_route: z.string().optional(),
  post_route_key_list: z.string().optional(),
  post_title_key: z.string().optional(),
  post_description_key: z.string().optional(),
  source_doctype: z.string().optional(),
  result_title_field: z.string().optional(),
  result_preview_field: z.string().optional(),
  result_route_field: z.string().optional(),
});

export type SupportSearchSource = z.infer<typeof SupportSearchSourceSchema>;

export const SupportSearchSourceInsertSchema = SupportSearchSourceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupportSearchSourceInsert = z.infer<typeof SupportSearchSourceInsertSchema>;
