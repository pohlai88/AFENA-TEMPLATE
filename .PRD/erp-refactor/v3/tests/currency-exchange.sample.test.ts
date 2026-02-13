import { describe, it, expect } from 'vitest';
import { CurrencyExchangeSchema, CurrencyExchangeInsertSchema } from '../types/currency-exchange.js';

describe('CurrencyExchange Zod validation', () => {
  const validSample = {
      "id": "TEST-CurrencyExchange-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "date": "2024-01-15",
      "from_currency": "LINK-from_currency-001",
      "to_currency": "LINK-to_currency-001",
      "exchange_rate": 1,
      "for_buying": "1",
      "for_selling": "1"
  };

  it('validates a correct Currency Exchange object', () => {
    const result = CurrencyExchangeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CurrencyExchangeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "date" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).date;
    const result = CurrencyExchangeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CurrencyExchangeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
