import { describe, it, expect } from 'vitest';
import { QualityReviewSchema, QualityReviewInsertSchema } from '../types/quality-review.js';

describe('QualityReview Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityReview-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "goal": "LINK-goal-001",
      "date": "Today",
      "procedure": "LINK-procedure-001",
      "status": "Open",
      "additional_information": "Sample text for additional_information"
  };

  it('validates a correct Quality Review object', () => {
    const result = QualityReviewSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityReviewInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "goal" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).goal;
    const result = QualityReviewSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityReviewSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
