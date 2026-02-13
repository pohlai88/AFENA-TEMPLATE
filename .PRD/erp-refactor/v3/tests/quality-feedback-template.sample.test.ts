import { describe, it, expect } from 'vitest';
import { QualityFeedbackTemplateSchema, QualityFeedbackTemplateInsertSchema } from '../types/quality-feedback-template.js';

describe('QualityFeedbackTemplate Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityFeedbackTemplate-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "template": "Sample Template Name"
  };

  it('validates a correct Quality Feedback Template object', () => {
    const result = QualityFeedbackTemplateSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityFeedbackTemplateInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "template" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).template;
    const result = QualityFeedbackTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityFeedbackTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
