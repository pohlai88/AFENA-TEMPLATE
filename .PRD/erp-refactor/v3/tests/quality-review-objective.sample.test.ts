import { describe, it, expect } from 'vitest';
import { QualityReviewObjectiveSchema, QualityReviewObjectiveInsertSchema } from '../types/quality-review-objective.js';

describe('QualityReviewObjective Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityReviewObjective-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "objective": "Sample text for objective",
      "target": "Sample Target",
      "uom": "LINK-uom-001",
      "status": "Open",
      "review": "Sample text for review"
  };

  it('validates a correct Quality Review Objective object', () => {
    const result = QualityReviewObjectiveSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityReviewObjectiveInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityReviewObjectiveSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
