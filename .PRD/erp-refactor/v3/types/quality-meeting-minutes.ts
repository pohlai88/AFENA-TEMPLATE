import { z } from 'zod';

export const QualityMeetingMinutesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  document_type: z.enum(['Quality Review', 'Quality Action', 'Quality Feedback']),
  document_name: z.string().optional(),
  minute: z.string().optional(),
});

export type QualityMeetingMinutes = z.infer<typeof QualityMeetingMinutesSchema>;

export const QualityMeetingMinutesInsertSchema = QualityMeetingMinutesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityMeetingMinutesInsert = z.infer<typeof QualityMeetingMinutesInsertSchema>;
