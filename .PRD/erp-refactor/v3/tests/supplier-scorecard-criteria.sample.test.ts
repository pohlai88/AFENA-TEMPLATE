import { describe, it, expect } from 'vitest';
import { SupplierScorecardCriteriaSchema, SupplierScorecardCriteriaInsertSchema } from '../types/supplier-scorecard-criteria.js';

describe('SupplierScorecardCriteria Zod validation', () => {
  const validSample = {
      "id": "TEST-SupplierScorecardCriteria-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "criteria_name": "Sample Criteria Name",
      "max_score": "100",
      "formula": "Sample text for formula",
      "weight": 1
  };

  it('validates a correct Supplier Scorecard Criteria object', () => {
    const result = SupplierScorecardCriteriaSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupplierScorecardCriteriaInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "criteria_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).criteria_name;
    const result = SupplierScorecardCriteriaSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupplierScorecardCriteriaSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
