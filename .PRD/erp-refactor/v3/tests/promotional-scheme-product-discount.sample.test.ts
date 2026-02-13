import { describe, it, expect } from 'vitest';
import { PromotionalSchemeProductDiscountSchema, PromotionalSchemeProductDiscountInsertSchema } from '../types/promotional-scheme-product-discount.js';

describe('PromotionalSchemeProductDiscount Zod validation', () => {
  const validSample = {
      "id": "TEST-PromotionalSchemeProductDiscount-001",
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
      "same_item": "0",
      "free_item": "LINK-free_item-001",
      "free_qty": 1,
      "free_item_uom": "LINK-free_item_uom-001",
      "free_item_rate": 100,
      "round_free_qty": "0",
      "warehouse": "LINK-warehouse-001",
      "threshold_percentage": 1,
      "priority": "1",
      "is_recursive": "0",
      "recurse_for": "0",
      "apply_recursion_over": "0"
  };

  it('validates a correct Promotional Scheme Product Discount object', () => {
    const result = PromotionalSchemeProductDiscountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PromotionalSchemeProductDiscountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "rule_description" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).rule_description;
    const result = PromotionalSchemeProductDiscountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PromotionalSchemeProductDiscountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
