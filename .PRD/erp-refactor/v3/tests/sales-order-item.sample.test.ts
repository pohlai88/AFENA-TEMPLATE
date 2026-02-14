import { describe, it, expect } from 'vitest';
import { SalesOrderItemSchema, SalesOrderItemInsertSchema } from '../types/sales-order-item.js';

describe('SalesOrderItem Zod validation', () => {
  const validSample = {
      "id": "TEST-SalesOrderItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "fg_item": "LINK-fg_item-001",
      "fg_item_qty": 1,
      "item_code": "LINK-item_code-001",
      "customer_item_code": "Sample Customer's Item Code",
      "ensure_delivery_based_on_produced_serial_no": "0",
      "is_stock_item": "0",
      "reserve_stock": "1",
      "delivery_date": "2024-01-15",
      "item_name": "Sample Item Name",
      "description": "Sample text for description",
      "item_group": "LINK-item_group-001",
      "brand": "LINK-brand-001",
      "image": "/files/sample.png",
      "image_view": "/files/sample.png",
      "qty": 1,
      "stock_uom": "LINK-stock_uom-001",
      "subcontracted_qty": "0",
      "uom": "LINK-uom-001",
      "conversion_factor": 1,
      "stock_qty": 1,
      "stock_reserved_qty": "0",
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
      "stock_uom_rate": 100,
      "is_free_item": "0",
      "grant_commission": "0",
      "net_rate": 100,
      "net_amount": 100,
      "base_net_rate": 100,
      "base_net_amount": 100,
      "billed_amt": 100,
      "valuation_rate": 100,
      "gross_profit": 100,
      "delivered_by_supplier": "0",
      "supplier": "LINK-supplier-001",
      "weight_per_unit": 1,
      "total_weight": 1,
      "weight_uom": "LINK-weight_uom-001",
      "warehouse": "LINK-warehouse-001",
      "target_warehouse": "LINK-target_warehouse-001",
      "prevdoc_docname": "LINK-prevdoc_docname-001",
      "quotation_item": "Sample quotation_item",
      "against_blanket_order": "0",
      "blanket_order": "LINK-blanket_order-001",
      "blanket_order_rate": 100,
      "actual_qty": 1,
      "company_total_stock": 1,
      "bom_no": "LINK-bom_no-001",
      "projected_qty": 1,
      "ordered_qty": 1,
      "planned_qty": 1,
      "production_plan_qty": 1,
      "work_order_qty": 1,
      "delivered_qty": 1,
      "produced_qty": 1,
      "returned_qty": 1,
      "picked_qty": 1,
      "additional_notes": "Sample text for additional_notes",
      "page_break": "0",
      "item_tax_rate": "console.log(\"hello\");",
      "transaction_date": "2024-01-15",
      "material_request": "LINK-material_request-001",
      "purchase_order": "LINK-purchase_order-001",
      "material_request_item": "Sample Material Request Item",
      "purchase_order_item": "Sample Purchase Order Item",
      "cost_center": ":Company",
      "project": "LINK-project-001"
  };

  it('validates a correct Sales Order Item object', () => {
    const result = SalesOrderItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SalesOrderItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = SalesOrderItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SalesOrderItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
