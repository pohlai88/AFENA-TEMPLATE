import { describe, it, expect } from 'vitest';
import { PricingRuleItemGroupSchema, PricingRuleItemGroupInsertSchema } from '../types/pricing-rule-item-group.js';

describe('PricingRuleItemGroup Zod validation', () => {
  const validSample = {
      "id": "TEST-PricingRuleItemGroup-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_group": "LINK-item_group-001",
      "uom": "LINK-uom-001"
  };

  it('validates a correct Pricing Rule Item Group object', () => {
    const result = PricingRuleItemGroupSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PricingRuleItemGroupInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PricingRuleItemGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
