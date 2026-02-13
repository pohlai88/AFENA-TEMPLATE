import { describe, it, expect } from 'vitest';
import { DeliveryNoteItemSchema, DeliveryNoteItemInsertSchema } from '../types/delivery-note-item.js';

describe('DeliveryNoteItem Zod validation', () => {
  const validSample = {
      "id": "TEST-DeliveryNoteItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "barcode": "Sample Barcode",
      "has_item_scanned": "0",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "customer_item_code": "Sample Customer's Item Code",
      "description": "Sample text for description",
      "brand": "LINK-brand-001",
      "item_group": "LINK-item_group-001",
      "image": "/files/sample.png",
      "image_view": "/files/sample.png",
      "qty": 1,
      "stock_uom": "LINK-stock_uom-001",
      "uom": "LINK-uom-001",
      "conversion_factor": 1,
      "stock_qty": 1,
      "returned_qty": 1,
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
      "base_rate": 100,
      "base_amount": 100,
      "pricing_rules": "Sample text for pricing_rules",
      "stock_uom_rate": 100,
      "is_free_item": "0",
      "grant_commission": "0",
      "net_rate": 100,
      "net_amount": 100,
      "item_tax_template": "LINK-item_tax_template-001",
      "base_net_rate": 100,
      "base_net_amount": 100,
      "billed_amt": 100,
      "incoming_rate": 100,
      "weight_per_unit": 1,
      "total_weight": 1,
      "weight_uom": "LINK-weight_uom-001",
      "warehouse": "LINK-warehouse-001",
      "target_warehouse": "LINK-target_warehouse-001",
      "quality_inspection": "LINK-quality_inspection-001",
      "allow_zero_valuation_rate": "0",
      "against_sales_order": "LINK-against_sales_order-001",
      "so_detail": "Sample Against Sales Order Item",
      "against_sales_invoice": "LINK-against_sales_invoice-001",
      "si_detail": "Sample Against Sales Invoice Item",
      "dn_detail": "Sample Against Delivery Note Item",
      "against_pick_list": "LINK-against_pick_list-001",
      "pick_list_item": "Sample Pick List Item",
      "serial_and_batch_bundle": "LINK-serial_and_batch_bundle-001",
      "use_serial_batch_fields": "0",
      "serial_no": "Sample text for serial_no",
      "batch_no": "LINK-batch_no-001",
      "actual_qty": 1,
      "actual_batch_qty": 1,
      "company_total_stock": 1,
      "installed_qty": 1,
      "packed_qty": "0",
      "received_qty": 1,
      "expense_account": "LINK-expense_account-001",
      "item_tax_rate": "Sample text for item_tax_rate",
      "material_request": "LINK-material_request-001",
      "purchase_order": "LINK-purchase_order-001",
      "purchase_order_item": "Sample Purchase Order Item",
      "material_request_item": "Sample Material Request Item",
      "cost_center": ":Company",
      "project": "LINK-project-001",
      "page_break": "0"
  };

  it('validates a correct Delivery Note Item object', () => {
    const result = DeliveryNoteItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DeliveryNoteItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = DeliveryNoteItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DeliveryNoteItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
