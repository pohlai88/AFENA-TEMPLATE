import { z } from 'zod';

export const IssueSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['ISS-.YYYY.-']).optional(),
  subject: z.string(),
  customer: z.string().optional(),
  raised_by: z.string().email().optional(),
  status: z.enum(['Open', 'Replied', 'On Hold', 'Resolved', 'Closed']).optional().default('Open'),
  priority: z.string().optional(),
  issue_type: z.string().optional(),
  issue_split_from: z.string().optional(),
  description: z.string().optional(),
  service_level_agreement: z.string().optional(),
  response_by: z.string().optional(),
  agreement_status: z.enum(['First Response Due', 'Resolution Due', 'Fulfilled', 'Failed']).optional().default('First Response Due'),
  sla_resolution_by: z.string().optional(),
  service_level_agreement_creation: z.string().optional(),
  on_hold_since: z.string().optional(),
  total_hold_time: z.number().optional(),
  first_response_time: z.number().optional(),
  first_responded_on: z.string().optional(),
  avg_response_time: z.number().optional(),
  resolution_details: z.string().optional(),
  opening_date: z.string().optional().default('Today'),
  opening_time: z.string().optional(),
  sla_resolution_date: z.string().optional(),
  resolution_time: z.number().optional(),
  user_resolution_time: z.number().optional(),
  lead: z.string().optional(),
  contact: z.string().optional(),
  email_account: z.string().optional(),
  customer_name: z.string().optional(),
  project: z.string().optional(),
  company: z.string().optional(),
  via_customer_portal: z.boolean().optional().default(false),
  attachment: z.string().optional(),
  content_type: z.string().optional(),
});

export type Issue = z.infer<typeof IssueSchema>;

export const IssueInsertSchema = IssueSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type IssueInsert = z.infer<typeof IssueInsertSchema>;
