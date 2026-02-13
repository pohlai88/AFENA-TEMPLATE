import { describe, it, expect } from 'vitest';
import { BudgetDistributionSchema, BudgetDistributionInsertSchema } from '../types/budget-distribution.js';

describe('BudgetDistribution Zod validation', () => {
  const validSample = {
      "id": "TEST-BudgetDistribution-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "start_date": "2024-01-15",
      "end_date": "2024-01-15",
      "amount": 100,
      "percent": 1
  };

  it('validates a correct Budget Distribution object', () => {
    const result = BudgetDistributionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BudgetDistributionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BudgetDistributionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
