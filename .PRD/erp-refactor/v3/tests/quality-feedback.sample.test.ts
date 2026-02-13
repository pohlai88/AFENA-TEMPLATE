import { describe, it, expect } from 'vitest';
import { QualityFeedbackSchema, QualityFeedbackInsertSchema } from '../types/quality-feedback.js';

describe('QualityFeedback Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityFeedback-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "template": "LINK-template-001",
      "document_type": "User",
      "document_name": "LINK-document_name-001"
  };

  it('validates a correct Quality Feedback object', () => {
    const result = QualityFeedbackSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityFeedbackInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "template" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).template;
    const result = QualityFeedbackSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityFeedbackSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
