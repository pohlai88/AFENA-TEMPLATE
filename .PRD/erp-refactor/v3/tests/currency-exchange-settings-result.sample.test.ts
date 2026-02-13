import { describe, it, expect } from 'vitest';
import { CurrencyExchangeSettingsResultSchema, CurrencyExchangeSettingsResultInsertSchema } from '../types/currency-exchange-settings-result.js';

describe('CurrencyExchangeSettingsResult Zod validation', () => {
  const validSample = {
      "id": "TEST-CurrencyExchangeSettingsResult-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "key": "Sample Key"
  };

  it('validates a correct Currency Exchange Settings Result object', () => {
    const result = CurrencyExchangeSettingsResultSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CurrencyExchangeSettingsResultInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "key" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).key;
    const result = CurrencyExchangeSettingsResultSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CurrencyExchangeSettingsResultSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
