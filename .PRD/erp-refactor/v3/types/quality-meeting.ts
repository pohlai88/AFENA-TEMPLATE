import { z } from 'zod';

export const QualityMeetingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  status: z.enum(['Open', 'Closed']).optional().default('Open'),
  agenda: z.array(z.unknown()).optional(),
  minutes: z.array(z.unknown()).optional(),
});

export type QualityMeeting = z.infer<typeof QualityMeetingSchema>;

export const QualityMeetingInsertSchema = QualityMeetingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityMeetingInsert = z.infer<typeof QualityMeetingInsertSchema>;
