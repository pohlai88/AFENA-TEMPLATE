import { describe, it, expect } from 'vitest';
import { DunningTypeSchema, DunningTypeInsertSchema } from '../types/dunning-type.js';

describe('DunningType Zod validation', () => {
  const validSample = {
      "id": "TEST-DunningType-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "dunning_type": "Sample Dunning Type",
      "is_default": "0",
      "company": "LINK-company-001",
      "dunning_fee": 100,
      "rate_of_interest": 1,
      "income_account": "LINK-income_account-001",
      "cost_center": "LINK-cost_center-001"
  };

  it('validates a correct Dunning Type object', () => {
    const result = DunningTypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DunningTypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "dunning_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).dunning_type;
    const result = DunningTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DunningTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
