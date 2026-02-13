import { describe, it, expect } from 'vitest';
import { GlobalDefaultsSchema, GlobalDefaultsInsertSchema } from '../types/global-defaults.js';

describe('GlobalDefaults Zod validation', () => {
  const validSample = {
      "id": "TEST-GlobalDefaults-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "default_company": "LINK-default_company-001",
      "country": "LINK-country-001",
      "default_distance_unit": "LINK-default_distance_unit-001",
      "default_currency": "INR",
      "hide_currency_symbol": "No",
      "disable_rounded_total": "0",
      "disable_in_words": "0",
      "use_posting_datetime_for_naming_documents": "0",
      "demo_company": "LINK-demo_company-001"
  };

  it('validates a correct Global Defaults object', () => {
    const result = GlobalDefaultsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = GlobalDefaultsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "default_currency" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).default_currency;
    const result = GlobalDefaultsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = GlobalDefaultsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
