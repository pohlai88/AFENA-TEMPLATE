import { describe, it, expect } from 'vitest';
import { MonthlyDistributionSchema, MonthlyDistributionInsertSchema } from '../types/monthly-distribution.js';

describe('MonthlyDistribution Zod validation', () => {
  const validSample = {
      "id": "TEST-MonthlyDistribution-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "distribution_id": "Sample Distribution Name",
      "fiscal_year": "LINK-fiscal_year-001"
  };

  it('validates a correct Monthly Distribution object', () => {
    const result = MonthlyDistributionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = MonthlyDistributionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "distribution_id" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).distribution_id;
    const result = MonthlyDistributionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = MonthlyDistributionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
