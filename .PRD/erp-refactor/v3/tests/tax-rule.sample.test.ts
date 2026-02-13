import { describe, it, expect } from 'vitest';
import { TaxRuleSchema, TaxRuleInsertSchema } from '../types/tax-rule.js';

describe('TaxRule Zod validation', () => {
  const validSample = {
      "id": "TEST-TaxRule-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "tax_type": "Sales",
      "use_for_shopping_cart": "1",
      "sales_tax_template": "LINK-sales_tax_template-001",
      "purchase_tax_template": "LINK-purchase_tax_template-001",
      "customer": "LINK-customer-001",
      "supplier": "LINK-supplier-001",
      "item": "LINK-item-001",
      "billing_city": "Sample Billing City",
      "billing_county": "Sample Billing County",
      "billing_state": "Sample Billing State",
      "billing_zipcode": "Sample Billing Zipcode",
      "billing_country": "LINK-billing_country-001",
      "tax_category": "LINK-tax_category-001",
      "customer_group": "LINK-customer_group-001",
      "supplier_group": "LINK-supplier_group-001",
      "item_group": "LINK-item_group-001",
      "shipping_city": "Sample Shipping City",
      "shipping_county": "Sample Shipping County",
      "shipping_state": "Sample Shipping State",
      "shipping_zipcode": "Sample Shipping Zipcode",
      "shipping_country": "LINK-shipping_country-001",
      "from_date": "2024-01-15",
      "to_date": "2024-01-15",
      "priority": "1",
      "company": "LINK-company-001"
  };

  it('validates a correct Tax Rule object', () => {
    const result = TaxRuleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TaxRuleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TaxRuleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
