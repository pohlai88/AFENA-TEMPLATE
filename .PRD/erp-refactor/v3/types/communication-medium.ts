import { z } from 'zod';

export const CommunicationMediumSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  communication_channel: z.string().optional(),
  communication_medium_type: z.enum(['Voice', 'Email', 'Chat']),
  catch_all: z.string().optional(),
  provider: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  timeslots: z.array(z.unknown()).optional(),
});

export type CommunicationMedium = z.infer<typeof CommunicationMediumSchema>;

export const CommunicationMediumInsertSchema = CommunicationMediumSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CommunicationMediumInsert = z.infer<typeof CommunicationMediumInsertSchema>;
