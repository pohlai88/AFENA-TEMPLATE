import { describe, it, expect } from 'vitest';
import { PricingRuleSchema, PricingRuleInsertSchema } from '../types/pricing-rule.js';

describe('PricingRule Zod validation', () => {
  const validSample = {
      "id": "TEST-PricingRule-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "naming_series": "PRLE-.####",
      "title": "Sample Title",
      "disable": "0",
      "apply_on": "Item Code",
      "price_or_product_discount": "Price",
      "warehouse": "LINK-warehouse-001",
      "mixed_conditions": "0",
      "is_cumulative": "0",
      "coupon_code_based": "0",
      "apply_rule_on_other": "Item Code",
      "other_item_code": "LINK-other_item_code-001",
      "other_item_group": "LINK-other_item_group-001",
      "other_brand": "LINK-other_brand-001",
      "selling": "0",
      "buying": "0",
      "applicable_for": "Customer",
      "customer": "LINK-customer-001",
      "customer_group": "LINK-customer_group-001",
      "territory": "LINK-territory-001",
      "sales_partner": "LINK-sales_partner-001",
      "campaign": "LINK-campaign-001",
      "supplier": "LINK-supplier-001",
      "supplier_group": "LINK-supplier_group-001",
      "min_qty": 1,
      "max_qty": 1,
      "min_amt": "0",
      "max_amt": "0",
      "same_item": "0",
      "free_item": "LINK-free_item-001",
      "free_qty": "0",
      "free_item_rate": 100,
      "free_item_uom": "LINK-free_item_uom-001",
      "round_free_qty": "0",
      "dont_enforce_free_item_qty": "0",
      "is_recursive": "0",
      "recurse_for": 1,
      "apply_recursion_over": "0",
      "valid_from": "Today",
      "valid_upto": "2024-01-15",
      "company": "LINK-company-001",
      "currency": "LINK-currency-001",
      "margin_type": "Percentage",
      "margin_rate_or_amount": "0",
      "rate_or_discount": "Discount Percentage",
      "apply_discount_on": "Grand Total",
      "rate": "0",
      "discount_amount": "0",
      "discount_percentage": 1,
      "for_price_list": "LINK-for_price_list-001",
      "condition": "console.log(\"hello\");",
      "apply_multiple_pricing_rules": "0",
      "apply_discount_on_rate": "0",
      "threshold_percentage": 1,
      "validate_applied_rule": "0",
      "rule_description": "Sample text for rule_description",
      "has_priority": "0",
      "priority": "1",
      "pricing_rule_help": "Sample text for pricing_rule_help",
      "promotional_scheme_id": "Sample Promotional Scheme Id",
      "promotional_scheme": "LINK-promotional_scheme-001"
  };

  it('validates a correct Pricing Rule object', () => {
    const result = PricingRuleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PricingRuleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "title" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).title;
    const result = PricingRuleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PricingRuleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
