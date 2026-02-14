import { describe, it, expect } from 'vitest';
import { QualityActionSchema, QualityActionInsertSchema } from '../types/quality-action.js';

describe('QualityAction Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityAction-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "corrective_preventive": "Corrective",
      "review": "LINK-review-001",
      "feedback": "LINK-feedback-001",
      "status": "Open",
      "date": "Today",
      "goal": "LINK-goal-001",
      "procedure": "LINK-procedure-001"
  };

  it('validates a correct Quality Action object', () => {
    const result = QualityActionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityActionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "corrective_preventive" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).corrective_preventive;
    const result = QualityActionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityActionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
