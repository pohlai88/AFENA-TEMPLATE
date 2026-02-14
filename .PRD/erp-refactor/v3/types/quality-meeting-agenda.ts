import { z } from 'zod';

export const QualityMeetingAgendaSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  agenda: z.string().optional(),
});

export type QualityMeetingAgenda = z.infer<typeof QualityMeetingAgendaSchema>;

export const QualityMeetingAgendaInsertSchema = QualityMeetingAgendaSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityMeetingAgendaInsert = z.infer<typeof QualityMeetingAgendaInsertSchema>;
