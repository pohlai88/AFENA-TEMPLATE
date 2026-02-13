import { describe, it, expect } from 'vitest';
import { QualityMeetingMinutesSchema, QualityMeetingMinutesInsertSchema } from '../types/quality-meeting-minutes.js';

describe('QualityMeetingMinutes Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityMeetingMinutes-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "document_type": "Quality Review",
      "document_name": "LINK-document_name-001",
      "minute": "Sample text for minute"
  };

  it('validates a correct Quality Meeting Minutes object', () => {
    const result = QualityMeetingMinutesSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityMeetingMinutesInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "document_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).document_type;
    const result = QualityMeetingMinutesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityMeetingMinutesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
