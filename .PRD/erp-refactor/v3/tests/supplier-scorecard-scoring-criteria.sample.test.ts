import { describe, it, expect } from 'vitest';
import { SupplierScorecardScoringCriteriaSchema, SupplierScorecardScoringCriteriaInsertSchema } from '../types/supplier-scorecard-scoring-criteria.js';

describe('SupplierScorecardScoringCriteria Zod validation', () => {
  const validSample = {
      "id": "TEST-SupplierScorecardScoringCriteria-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "criteria_name": "LINK-criteria_name-001",
      "score": 1,
      "weight": 1,
      "max_score": "100",
      "formula": "Sample text for formula"
  };

  it('validates a correct Supplier Scorecard Scoring Criteria object', () => {
    const result = SupplierScorecardScoringCriteriaSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupplierScorecardScoringCriteriaInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "criteria_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).criteria_name;
    const result = SupplierScorecardScoringCriteriaSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupplierScorecardScoringCriteriaSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
