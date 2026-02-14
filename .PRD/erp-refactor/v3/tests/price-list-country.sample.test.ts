import { describe, it, expect } from 'vitest';
import { PriceListCountrySchema, PriceListCountryInsertSchema } from '../types/price-list-country.js';

describe('PriceListCountry Zod validation', () => {
  const validSample = {
      "id": "TEST-PriceListCountry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "country": "LINK-country-001"
  };

  it('validates a correct Price List Country object', () => {
    const result = PriceListCountrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PriceListCountryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "country" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).country;
    const result = PriceListCountrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PriceListCountrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
