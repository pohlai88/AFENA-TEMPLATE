import { describe, it, expect } from 'vitest';
import { PosInvoiceItemSchema, PosInvoiceItemInsertSchema } from '../types/pos-invoice-item.js';

describe('PosInvoiceItem Zod validation', () => {
  const validSample = {
      "id": "TEST-PosInvoiceItem-001",
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
      "item_group": "LINK-item_group-001",
      "brand": "Sample Brand Name",
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
      "base_rate_with_margin": 100,
      "rate": 100,
      "amount": 100,
      "item_tax_template": "LINK-item_tax_template-001",
      "base_rate": 100,
      "base_amount": 100,
      "pricing_rules": "Sample text for pricing_rules",
      "is_free_item": "0",
      "grant_commission": "0",
      "net_rate": 100,
      "net_amount": 100,
      "base_net_rate": 100,
      "base_net_amount": 100,
      "delivered_by_supplier": "0",
      "income_account": "LINK-income_account-001",
      "is_fixed_asset": "0",
      "asset": "LINK-asset-001",
      "finance_book": "LINK-finance_book-001",
      "expense_account": "LINK-expense_account-001",
      "deferred_revenue_account": "LINK-deferred_revenue_account-001",
      "service_stop_date": "2024-01-15",
      "enable_deferred_revenue": "0",
      "service_start_date": "2024-01-15",
      "service_end_date": "2024-01-15",
      "weight_per_unit": 1,
      "total_weight": 1,
      "weight_uom": "LINK-weight_uom-001",
      "warehouse": "LINK-warehouse-001",
      "target_warehouse": "LINK-target_warehouse-001",
      "quality_inspection": "LINK-quality_inspection-001",
      "serial_and_batch_bundle": "LINK-serial_and_batch_bundle-001",
      "use_serial_batch_fields": "0",
      "allow_zero_valuation_rate": "0",
      "item_tax_rate": "Sample text for item_tax_rate",
      "actual_batch_qty": 1,
      "actual_qty": 1,
      "serial_no": "Sample text for serial_no",
      "batch_no": "LINK-batch_no-001",
      "sales_order": "LINK-sales_order-001",
      "so_detail": "Sample Sales Order Item",
      "pos_invoice_item": "Sample POS Invoice Item",
      "delivery_note": "LINK-delivery_note-001",
      "dn_detail": "Sample Delivery Note Item",
      "delivered_qty": 1,
      "cost_center": ":Company",
      "project": "LINK-project-001",
      "page_break": "0"
  };

  it('validates a correct POS Invoice Item object', () => {
    const result = PosInvoiceItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosInvoiceItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_name;
    const result = PosInvoiceItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosInvoiceItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
