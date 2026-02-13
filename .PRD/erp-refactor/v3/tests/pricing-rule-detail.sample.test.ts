import { describe, it, expect } from 'vitest';
import { PricingRuleDetailSchema, PricingRuleDetailInsertSchema } from '../types/pricing-rule-detail.js';

describe('PricingRuleDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-PricingRuleDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "pricing_rule": "LINK-pricing_rule-001",
      "item_code": "Sample Item Code",
      "margin_type": "Sample Margin Type",
      "rate_or_discount": "Sample Rate or Discount",
      "child_docname": "Sample Child Docname",
      "rule_applied": "1"
  };

  it('validates a correct Pricing Rule Detail object', () => {
    const result = PricingRuleDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PricingRuleDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PricingRuleDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
