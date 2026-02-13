import { describe, it, expect } from 'vitest';
import { ShippingRuleConditionSchema, ShippingRuleConditionInsertSchema } from '../types/shipping-rule-condition.js';

describe('ShippingRuleCondition Zod validation', () => {
  const validSample = {
      "id": "TEST-ShippingRuleCondition-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "from_value": 1,
      "to_value": 1,
      "shipping_amount": 100
  };

  it('validates a correct Shipping Rule Condition object', () => {
    const result = ShippingRuleConditionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ShippingRuleConditionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "from_value" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).from_value;
    const result = ShippingRuleConditionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ShippingRuleConditionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
