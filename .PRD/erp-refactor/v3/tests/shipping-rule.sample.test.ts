import { describe, it, expect } from 'vitest';
import { ShippingRuleSchema, ShippingRuleInsertSchema } from '../types/shipping-rule.js';

describe('ShippingRule Zod validation', () => {
  const validSample = {
      "id": "TEST-ShippingRule-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "label": "Sample Shipping Rule Label",
      "disabled": "0",
      "shipping_rule_type": "Selling",
      "company": "LINK-company-001",
      "account": "LINK-account-001",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "calculate_based_on": "Fixed",
      "shipping_amount": 100
  };

  it('validates a correct Shipping Rule object', () => {
    const result = ShippingRuleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ShippingRuleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "label" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).label;
    const result = ShippingRuleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ShippingRuleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
