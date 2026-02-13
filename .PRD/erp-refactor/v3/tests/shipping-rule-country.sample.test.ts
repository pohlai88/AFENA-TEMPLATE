import { describe, it, expect } from 'vitest';
import { ShippingRuleCountrySchema, ShippingRuleCountryInsertSchema } from '../types/shipping-rule-country.js';

describe('ShippingRuleCountry Zod validation', () => {
  const validSample = {
      "id": "TEST-ShippingRuleCountry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "country": "LINK-country-001"
  };

  it('validates a correct Shipping Rule Country object', () => {
    const result = ShippingRuleCountrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ShippingRuleCountryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "country" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).country;
    const result = ShippingRuleCountrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ShippingRuleCountrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
