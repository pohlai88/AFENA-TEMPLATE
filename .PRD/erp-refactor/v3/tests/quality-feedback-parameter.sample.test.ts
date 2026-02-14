import { describe, it, expect } from 'vitest';
import { QualityFeedbackParameterSchema, QualityFeedbackParameterInsertSchema } from '../types/quality-feedback-parameter.js';

describe('QualityFeedbackParameter Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityFeedbackParameter-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "parameter": "Sample Parameter",
      "rating": "1",
      "feedback": "Sample text for feedback"
  };

  it('validates a correct Quality Feedback Parameter object', () => {
    const result = QualityFeedbackParameterSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityFeedbackParameterInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "rating" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).rating;
    const result = QualityFeedbackParameterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityFeedbackParameterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
