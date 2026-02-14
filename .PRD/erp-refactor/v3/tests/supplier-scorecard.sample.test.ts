import { describe, it, expect } from 'vitest';
import { SupplierScorecardSchema, SupplierScorecardInsertSchema } from '../types/supplier-scorecard.js';

describe('SupplierScorecard Zod validation', () => {
  const validSample = {
      "id": "TEST-SupplierScorecard-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "supplier": "LINK-supplier-001",
      "supplier_score": "Sample Supplier Score",
      "indicator_color": "Sample Indicator Color",
      "status": "Sample Status",
      "period": "Per Month",
      "weighting_function": "{total_score} * max( 0, min ( 1 , (12 - {period_number}) / 12) )",
      "warn_rfqs": "0",
      "warn_pos": "0",
      "prevent_rfqs": "0",
      "prevent_pos": "0",
      "notify_supplier": "0",
      "notify_employee": "0",
      "employee": "LINK-employee-001"
  };

  it('validates a correct Supplier Scorecard object', () => {
    const result = SupplierScorecardSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupplierScorecardInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "period" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).period;
    const result = SupplierScorecardSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupplierScorecardSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
