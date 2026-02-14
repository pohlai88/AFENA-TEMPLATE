import { describe, it, expect } from 'vitest';
import { TaxWithholdingRateSchema, TaxWithholdingRateInsertSchema } from '../types/tax-withholding-rate.js';

describe('TaxWithholdingRate Zod validation', () => {
  const validSample = {
      "id": "TEST-TaxWithholdingRate-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "from_date": "2024-01-15",
      "to_date": "2024-01-15",
      "tax_withholding_group": "LINK-tax_withholding_group-001",
      "tax_withholding_rate": 1,
      "cumulative_threshold": 1,
      "single_threshold": 1
  };

  it('validates a correct Tax Withholding Rate object', () => {
    const result = TaxWithholdingRateSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TaxWithholdingRateInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "from_date" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).from_date;
    const result = TaxWithholdingRateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TaxWithholdingRateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
