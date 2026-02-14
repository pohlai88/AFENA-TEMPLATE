import { describe, it, expect } from 'vitest';
import { PromotionalSchemePriceDiscountSchema, PromotionalSchemePriceDiscountInsertSchema } from '../types/promotional-scheme-price-discount.js';

describe('PromotionalSchemePriceDiscount Zod validation', () => {
  const validSample = {
      "id": "TEST-PromotionalSchemePriceDiscount-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "disable": "0",
      "apply_multiple_pricing_rules": "0",
      "rule_description": "Sample text for rule_description",
      "min_qty": "0",
      "max_qty": "0",
      "min_amount": "0",
      "max_amount": "0",
      "rate_or_discount": "Discount Percentage",
      "rate": 100,
      "discount_amount": 100,
      "discount_percentage": 1,
      "for_price_list": "LINK-for_price_list-001",
      "warehouse": "LINK-warehouse-001",
      "threshold_percentage": 1,
      "validate_applied_rule": "0",
      "priority": "1",
      "apply_discount_on_rate": "0"
  };

  it('validates a correct Promotional Scheme Price Discount object', () => {
    const result = PromotionalSchemePriceDiscountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PromotionalSchemePriceDiscountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "rule_description" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).rule_description;
    const result = PromotionalSchemePriceDiscountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PromotionalSchemePriceDiscountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
