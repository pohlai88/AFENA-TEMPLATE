import { describe, it, expect } from 'vitest';
import { QualityMeetingAgendaSchema, QualityMeetingAgendaInsertSchema } from '../types/quality-meeting-agenda.js';

describe('QualityMeetingAgenda Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityMeetingAgenda-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "agenda": "Sample text for agenda"
  };

  it('validates a correct Quality Meeting Agenda object', () => {
    const result = QualityMeetingAgendaSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityMeetingAgendaInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityMeetingAgendaSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
