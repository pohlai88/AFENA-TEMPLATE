import { describe, it, expect } from 'vitest';
import { PricingRuleItemCodeSchema, PricingRuleItemCodeInsertSchema } from '../types/pricing-rule-item-code.js';

describe('PricingRuleItemCode Zod validation', () => {
  const validSample = {
      "id": "TEST-PricingRuleItemCode-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "uom": "LINK-uom-001"
  };

  it('validates a correct Pricing Rule Item Code object', () => {
    const result = PricingRuleItemCodeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PricingRuleItemCodeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PricingRuleItemCodeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
