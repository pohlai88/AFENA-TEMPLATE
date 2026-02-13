import { describe, it, expect } from 'vitest';
import { CurrencyExchangeSettingsDetailsSchema, CurrencyExchangeSettingsDetailsInsertSchema } from '../types/currency-exchange-settings-details.js';

describe('CurrencyExchangeSettingsDetails Zod validation', () => {
  const validSample = {
      "id": "TEST-CurrencyExchangeSettingsDetails-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "key": "Sample Key",
      "value": "Sample Value"
  };

  it('validates a correct Currency Exchange Settings Details object', () => {
    const result = CurrencyExchangeSettingsDetailsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CurrencyExchangeSettingsDetailsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "key" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).key;
    const result = CurrencyExchangeSettingsDetailsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CurrencyExchangeSettingsDetailsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
