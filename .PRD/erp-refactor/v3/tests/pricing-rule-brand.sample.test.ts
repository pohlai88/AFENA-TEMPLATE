import { describe, it, expect } from 'vitest';
import { PricingRuleBrandSchema, PricingRuleBrandInsertSchema } from '../types/pricing-rule-brand.js';

describe('PricingRuleBrand Zod validation', () => {
  const validSample = {
      "id": "TEST-PricingRuleBrand-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "brand": "LINK-brand-001",
      "uom": "LINK-uom-001"
  };

  it('validates a correct Pricing Rule Brand object', () => {
    const result = PricingRuleBrandSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PricingRuleBrandInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PricingRuleBrandSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
