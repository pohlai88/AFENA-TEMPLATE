import { z } from 'zod';

export const CallLogSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  id: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  call_received_by: z.string().optional(),
  employee_user_id: z.string().optional(),
  medium: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  type: z.enum(['Incoming', 'Outgoing']).optional(),
  customer: z.string().optional(),
  status: z.enum(['Ringing', 'In Progress', 'Completed', 'Failed', 'Busy', 'No Answer', 'Queued', 'Cancelled']).optional(),
  duration: z.number().optional(),
  recording_url: z.string().optional(),
  recording_html: z.string().optional(),
  type_of_call: z.string().optional(),
  summary: z.string().optional(),
  links: z.array(z.unknown()).optional(),
});

export type CallLog = z.infer<typeof CallLogSchema>;

export const CallLogInsertSchema = CallLogSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CallLogInsert = z.infer<typeof CallLogInsertSchema>;
