import { describe, it, expect } from 'vitest';
import { SupplierScorecardPeriodSchema, SupplierScorecardPeriodInsertSchema } from '../types/supplier-scorecard-period.js';

describe('SupplierScorecardPeriod Zod validation', () => {
  const validSample = {
      "id": "TEST-SupplierScorecardPeriod-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "supplier": "LINK-supplier-001",
      "naming_series": "Option1",
      "total_score": 1,
      "start_date": "2024-01-15",
      "end_date": "2024-01-15",
      "scorecard": "LINK-scorecard-001",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Supplier Scorecard Period object', () => {
    const result = SupplierScorecardPeriodSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupplierScorecardPeriodInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "supplier" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).supplier;
    const result = SupplierScorecardPeriodSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupplierScorecardPeriodSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
