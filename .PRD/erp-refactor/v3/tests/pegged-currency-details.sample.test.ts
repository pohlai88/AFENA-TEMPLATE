import { describe, it, expect } from 'vitest';
import { PeggedCurrencyDetailsSchema, PeggedCurrencyDetailsInsertSchema } from '../types/pegged-currency-details.js';

describe('PeggedCurrencyDetails Zod validation', () => {
  const validSample = {
      "id": "TEST-PeggedCurrencyDetails-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "source_currency": "LINK-source_currency-001",
      "pegged_against": "LINK-pegged_against-001",
      "pegged_exchange_rate": "Sample Exchange Rate"
  };

  it('validates a correct Pegged Currency Details object', () => {
    const result = PeggedCurrencyDetailsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PeggedCurrencyDetailsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PeggedCurrencyDetailsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
