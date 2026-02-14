import { describe, it, expect } from 'vitest';
import { SupplierQuotationItemSchema, SupplierQuotationItemInsertSchema } from '../types/supplier-quotation-item.js';

describe('SupplierQuotationItem Zod validation', () => {
  const validSample = {
      "id": "TEST-SupplierQuotationItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "supplier_part_no": "Sample Supplier Part Number",
      "item_name": "Sample Item Name",
      "lead_time_days": 1,
      "expected_delivery_date": "2024-01-15",
      "is_free_item": "0",
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
      "price_list_rate": 100,
      "base_price_list_rate": 100,
      "margin_type": "Percentage",
      "margin_rate_or_amount": 1,
      "rate_with_margin": 100,
      "discount_percentage": 1,
      "discount_amount": 100,
      "distributed_discount_amount": 100,
      "rate": 100,
      "amount": 100,
      "item_tax_template": "LINK-item_tax_template-001",
      "base_rate": 100,
      "base_amount": 100,
      "pricing_rules": "Sample text for pricing_rules",
      "net_rate": 100,
      "net_amount": 100,
      "base_net_rate": 100,
      "base_net_amount": 100,
      "weight_per_unit": 1,
      "total_weight": 1,
      "weight_uom": "LINK-weight_uom-001",
      "warehouse": "LINK-warehouse-001",
      "prevdoc_doctype": "Sample Reference Document Type",
      "material_request": "LINK-material_request-001",
      "sales_order": "LINK-sales_order-001",
      "request_for_quotation": "LINK-request_for_quotation-001",
      "material_request_item": "Sample Material Request Item",
      "request_for_quotation_item": "Sample Request for Quotation Item",
      "item_tax_rate": "console.log(\"hello\");",
      "manufacturer": "LINK-manufacturer-001",
      "manufacturer_part_no": "Sample Manufacturer Part Number",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "page_break": "0"
  };

  it('validates a correct Supplier Quotation Item object', () => {
    const result = SupplierQuotationItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupplierQuotationItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = SupplierQuotationItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupplierQuotationItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
