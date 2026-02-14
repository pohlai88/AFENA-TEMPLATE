import { describe, it, expect } from 'vitest';
import { MonthlyDistributionPercentageSchema, MonthlyDistributionPercentageInsertSchema } from '../types/monthly-distribution-percentage.js';

describe('MonthlyDistributionPercentage Zod validation', () => {
  const validSample = {
      "id": "TEST-MonthlyDistributionPercentage-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "month": "Sample Month",
      "percentage_allocation": 1
  };

  it('validates a correct Monthly Distribution Percentage object', () => {
    const result = MonthlyDistributionPercentageSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = MonthlyDistributionPercentageInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "month" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).month;
    const result = MonthlyDistributionPercentageSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = MonthlyDistributionPercentageSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
