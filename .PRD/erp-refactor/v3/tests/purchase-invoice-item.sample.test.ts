import { describe, it, expect } from 'vitest';
import { PurchaseInvoiceItemSchema, PurchaseInvoiceItemInsertSchema } from '../types/purchase-invoice-item.js';

describe('PurchaseInvoiceItem Zod validation', () => {
  const validSample = {
      "id": "TEST-PurchaseInvoiceItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "product_bundle": "LINK-product_bundle-001",
      "item_name": "Sample Item Name",
      "description": "Sample text for description",
      "brand": "LINK-brand-001",
      "item_group": "LINK-item_group-001",
      "image": "/files/sample.png",
      "image_view": "/files/sample.png",
      "received_qty": 1,
      "qty": 1,
      "rejected_qty": 1,
      "uom": "LINK-uom-001",
      "conversion_factor": 1,
      "stock_uom": "LINK-stock_uom-001",
      "stock_qty": 1,
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
      "amount": 100,
      "item_tax_template": "LINK-item_tax_template-001",
      "tax_withholding_category": "LINK-tax_withholding_category-001",
      "base_rate": 100,
      "base_amount": 100,
      "pricing_rules": "Sample text for pricing_rules",
      "stock_uom_rate": 100,
      "is_free_item": "0",
      "apply_tds": "1",
      "net_rate": 100,
      "net_amount": 100,
      "base_net_rate": 100,
      "base_net_amount": 100,
      "valuation_rate": 100,
      "sales_incoming_rate": 100,
      "item_tax_amount": 100,
      "landed_cost_voucher_amount": 100,
      "rm_supp_cost": 100,
      "warehouse": "LINK-warehouse-001",
      "serial_and_batch_bundle": "LINK-serial_and_batch_bundle-001",
      "use_serial_batch_fields": "0",
      "from_warehouse": "LINK-from_warehouse-001",
      "quality_inspection": "LINK-quality_inspection-001",
      "rejected_warehouse": "LINK-rejected_warehouse-001",
      "rejected_serial_and_batch_bundle": "LINK-rejected_serial_and_batch_bundle-001",
      "serial_no": "Sample text for serial_no",
      "rejected_serial_no": "Sample text for rejected_serial_no",
      "batch_no": "LINK-batch_no-001",
      "manufacturer": "LINK-manufacturer-001",
      "manufacturer_part_no": "Sample Manufacturer Part Number",
      "expense_account": "LINK-expense_account-001",
      "wip_composite_asset": "LINK-wip_composite_asset-001",
      "is_fixed_asset": "0",
      "asset_location": "LINK-asset_location-001",
      "asset_category": "LINK-asset_category-001",
      "deferred_expense_account": "LINK-deferred_expense_account-001",
      "service_stop_date": "2024-01-15",
      "enable_deferred_expense": "0",
      "service_start_date": "2024-01-15",
      "service_end_date": "2024-01-15",
      "allow_zero_valuation_rate": "0",
      "item_tax_rate": "console.log(\"hello\");",
      "bom": "LINK-bom-001",
      "include_exploded_items": "0",
      "purchase_invoice_item": "Sample Purchase Invoice Item",
      "purchase_order": "LINK-purchase_order-001",
      "po_detail": "Sample Purchase Order Item",
      "purchase_receipt": "LINK-purchase_receipt-001",
      "pr_detail": "Sample Purchase Receipt Detail",
      "sales_invoice_item": "Sample Sales Invoice Item",
      "material_request": "LINK-material_request-001",
      "material_request_item": "Sample Material Request Item",
      "weight_per_unit": 1,
      "total_weight": 1,
      "weight_uom": "LINK-weight_uom-001",
      "project": "LINK-project-001",
      "cost_center": ":Company",
      "page_break": "0"
  };

  it('validates a correct Purchase Invoice Item object', () => {
    const result = PurchaseInvoiceItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PurchaseInvoiceItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_name;
    const result = PurchaseInvoiceItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PurchaseInvoiceItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
