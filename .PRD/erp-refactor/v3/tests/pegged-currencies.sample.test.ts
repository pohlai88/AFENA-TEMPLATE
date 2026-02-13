import { describe, it, expect } from 'vitest';
import { PeggedCurrenciesSchema, PeggedCurrenciesInsertSchema } from '../types/pegged-currencies.js';

describe('PeggedCurrencies Zod validation', () => {
  const validSample = {
      "id": "TEST-PeggedCurrencies-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator"
  };

  it('validates a correct Pegged Currencies object', () => {
    const result = PeggedCurrenciesSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PeggedCurrenciesInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PeggedCurrenciesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
