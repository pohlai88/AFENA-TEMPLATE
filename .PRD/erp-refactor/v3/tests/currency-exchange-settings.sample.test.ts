import { describe, it, expect } from 'vitest';
import { CurrencyExchangeSettingsSchema, CurrencyExchangeSettingsInsertSchema } from '../types/currency-exchange-settings.js';

describe('CurrencyExchangeSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-CurrencyExchangeSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "disabled": "0",
      "service_provider": "frankfurter.dev",
      "api_endpoint": "Sample API Endpoint",
      "use_http": "0",
      "access_key": "Sample Access Key",
      "url": "Sample Example URL",
      "help": "Sample text for help"
  };

  it('validates a correct Currency Exchange Settings object', () => {
    const result = CurrencyExchangeSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CurrencyExchangeSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "service_provider" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).service_provider;
    const result = CurrencyExchangeSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CurrencyExchangeSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
