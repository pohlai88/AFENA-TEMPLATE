import { z } from 'zod';

export const VoiceCallSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  user: z.string(),
  call_receiving_device: z.enum(['Computer', 'Phone']).optional().default('Computer'),
  greeting_message: z.string().optional(),
  agent_busy_message: z.string().optional(),
  agent_unavailable_message: z.string().optional(),
});

export type VoiceCallSettings = z.infer<typeof VoiceCallSettingsSchema>;

export const VoiceCallSettingsInsertSchema = VoiceCallSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type VoiceCallSettingsInsert = z.infer<typeof VoiceCallSettingsInsertSchema>;
