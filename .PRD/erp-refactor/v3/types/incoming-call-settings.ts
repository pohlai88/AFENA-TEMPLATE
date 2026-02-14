import { z } from 'zod';

export const IncomingCallSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  call_routing: z.enum(['Sequential', 'Simultaneous']).optional().default('Sequential'),
  greeting_message: z.string().optional(),
  agent_busy_message: z.string().optional(),
  agent_unavailable_message: z.string().optional(),
  call_handling_schedule: z.array(z.unknown()),
});

export type IncomingCallSettings = z.infer<typeof IncomingCallSettingsSchema>;

export const IncomingCallSettingsInsertSchema = IncomingCallSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type IncomingCallSettingsInsert = z.infer<typeof IncomingCallSettingsInsertSchema>;
