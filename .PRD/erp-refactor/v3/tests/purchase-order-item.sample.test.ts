import { describe, it, expect } from 'vitest';
import { PurchaseOrderItemSchema, PurchaseOrderItemInsertSchema } from '../types/purchase-order-item.js';

describe('PurchaseOrderItem Zod validation', () => {
  const validSample = {
      "id": "TEST-PurchaseOrderItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "fg_item": "LINK-fg_item-001",
      "fg_item_qty": "1",
      "item_code": "LINK-item_code-001",
      "supplier_part_no": "Sample Supplier Part Number",
      "item_name": "Sample Item Name",
      "brand": "LINK-brand-001",
      "product_bundle": "LINK-product_bundle-001",
      "schedule_date": "2024-01-15",
      "expected_delivery_date": "2024-01-15",
      "item_group": "LINK-item_group-001",
      "description": "Sample text for description",
      "image": "/files/sample.png",
      "image_view": "/files/sample.png",
      "qty": 1,
      "stock_uom": "LINK-stock_uom-001",
      "subcontracted_qty": "0",
      "uom": "LINK-uom-001",
      "conversion_factor": 1,
      "stock_qty": 1,
      "price_list_rate": 100,
      "last_purchase_rate": 100,
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
      "net_rate": 100,
      "net_amount": 100,
      "base_net_rate": 100,
      "base_net_amount": 100,
      "from_warehouse": "LINK-from_warehouse-001",
      "warehouse": "LINK-warehouse-001",
      "actual_qty": 1,
      "company_total_stock": 1,
      "material_request": "LINK-material_request-001",
      "material_request_item": "Sample Material Request Item",
      "sales_order": "LINK-sales_order-001",
      "sales_order_item": "Sample Sales Order Item",
      "sales_order_packed_item": "Sample Sales Order Packed Item",
      "supplier_quotation": "LINK-supplier_quotation-001",
      "supplier_quotation_item": "LINK-supplier_quotation_item-001",
      "delivered_by_supplier": "0",
      "against_blanket_order": "0",
      "blanket_order": "LINK-blanket_order-001",
      "blanket_order_rate": 100,
      "received_qty": 1,
      "returned_qty": 1,
      "billed_amt": 100,
      "expense_account": "LINK-expense_account-001",
      "wip_composite_asset": "LINK-wip_composite_asset-001",
      "manufacturer": "LINK-manufacturer-001",
      "manufacturer_part_no": "Sample Manufacturer Part Number",
      "bom": "LINK-bom-001",
      "include_exploded_items": "0",
      "weight_per_unit": 1,
      "total_weight": 1,
      "weight_uom": "LINK-weight_uom-001",
      "project": "LINK-project-001",
      "cost_center": "LINK-cost_center-001",
      "is_fixed_asset": "0",
      "item_tax_rate": "console.log(\"hello\");",
      "production_plan": "LINK-production_plan-001",
      "production_plan_item": "Sample Production Plan Item",
      "production_plan_sub_assembly_item": "Sample Production Plan Sub Assembly Item",
      "page_break": "0",
      "job_card": "LINK-job_card-001"
  };

  it('validates a correct Purchase Order Item object', () => {
    const result = PurchaseOrderItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PurchaseOrderItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = PurchaseOrderItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PurchaseOrderItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
