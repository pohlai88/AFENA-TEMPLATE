import { describe, it, expect } from 'vitest';
import { QualityFeedbackTemplateParameterSchema, QualityFeedbackTemplateParameterInsertSchema } from '../types/quality-feedback-template-parameter.js';

describe('QualityFeedbackTemplateParameter Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityFeedbackTemplateParameter-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "parameter": "Sample Parameter"
  };

  it('validates a correct Quality Feedback Template Parameter object', () => {
    const result = QualityFeedbackTemplateParameterSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityFeedbackTemplateParameterInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityFeedbackTemplateParameterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
