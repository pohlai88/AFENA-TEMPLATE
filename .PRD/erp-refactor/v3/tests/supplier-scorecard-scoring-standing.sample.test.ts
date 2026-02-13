import { describe, it, expect } from 'vitest';
import { SupplierScorecardScoringStandingSchema, SupplierScorecardScoringStandingInsertSchema } from '../types/supplier-scorecard-scoring-standing.js';

describe('SupplierScorecardScoringStanding Zod validation', () => {
  const validSample = {
      "id": "TEST-SupplierScorecardScoringStanding-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "standing_name": "LINK-standing_name-001",
      "standing_color": "Blue",
      "min_grade": 1,
      "max_grade": 1,
      "warn_rfqs": "0",
      "warn_pos": "0",
      "prevent_rfqs": "0",
      "prevent_pos": "0",
      "notify_supplier": "0",
      "notify_employee": "0",
      "employee_link": "LINK-employee_link-001"
  };

  it('validates a correct Supplier Scorecard Scoring Standing object', () => {
    const result = SupplierScorecardScoringStandingSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupplierScorecardScoringStandingInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupplierScorecardScoringStandingSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
