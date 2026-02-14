import { describe, it, expect } from 'vitest';
import { QualityMeetingSchema, QualityMeetingInsertSchema } from '../types/quality-meeting.js';

describe('QualityMeeting Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityMeeting-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "status": "Open"
  };

  it('validates a correct Quality Meeting object', () => {
    const result = QualityMeetingSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityMeetingInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityMeetingSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
