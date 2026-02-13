import { describe, it, expect } from 'vitest';
import { QuotationItemSchema, QuotationItemInsertSchema } from '../types/quotation-item.js';

describe('QuotationItem Zod validation', () => {
  const validSample = {
      "id": "TEST-QuotationItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "customer_item_code": "Sample Customer's Item Code",
      "is_free_item": "0",
      "is_alternative": "0",
      "has_alternative_item": "0",
      "description": "Sample text for description",
      "item_group": "LINK-item_group-001",
      "brand": "LINK-brand-001",
      "image": "/files/sample.png",
      "image_view": "/files/sample.png",
      "qty": 1,
      "stock_uom": "LINK-stock_uom-001",
      "uom": "LINK-uom-001",
      "conversion_factor": 1,
      "stock_qty": 1,
      "ordered_qty": "0",
      "actual_qty": 1,
      "company_total_stock": 1,
      "price_list_rate": 100,
      "base_price_list_rate": 100,
      "margin_type": "Percentage",
      "margin_rate_or_amount": 1,
      "rate_with_margin": 100,
      "discount_percentage": 1,
      "discount_amount": 100,
      "distributed_discount_amount": 100,
      "base_rate_with_margin": 100,
      "rate": 100,
      "net_rate": 100,
      "amount": 100,
      "net_amount": 100,
      "item_tax_template": "LINK-item_tax_template-001",
      "base_rate": 100,
      "base_net_rate": 100,
      "base_amount": 100,
      "base_net_amount": 100,
      "pricing_rules": "Sample text for pricing_rules",
      "stock_uom_rate": 100,
      "valuation_rate": 100,
      "gross_profit": 100,
      "weight_per_unit": 1,
      "total_weight": 1,
      "weight_uom": "LINK-weight_uom-001",
      "warehouse": "LINK-warehouse-001",
      "against_blanket_order": "0",
      "blanket_order": "LINK-blanket_order-001",
      "blanket_order_rate": 100,
      "prevdoc_doctype": "LINK-prevdoc_doctype-001",
      "prevdoc_docname": "LINK-prevdoc_docname-001",
      "projected_qty": 1,
      "item_tax_rate": "console.log(\"hello\");",
      "additional_notes": "Sample text for additional_notes",
      "page_break": "0"
  };

  it('validates a correct Quotation Item object', () => {
    const result = QuotationItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QuotationItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_name;
    const result = QuotationItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QuotationItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
