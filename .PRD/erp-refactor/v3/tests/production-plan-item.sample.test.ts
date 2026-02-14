import { describe, it, expect } from 'vitest';
import { ProductionPlanItemSchema, ProductionPlanItemInsertSchema } from '../types/production-plan-item.js';

describe('ProductionPlanItem Zod validation', () => {
  const validSample = {
      "id": "TEST-ProductionPlanItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "include_exploded_items": "1",
      "item_code": "LINK-item_code-001",
      "bom_no": "LINK-bom_no-001",
      "planned_qty": 1,
      "stock_uom": "LINK-stock_uom-001",
      "warehouse": "LINK-warehouse-001",
      "planned_start_date": "Today",
      "pending_qty": "0",
      "ordered_qty": "0",
      "description": "Sample text for description",
      "produced_qty": "0",
      "sales_order": "LINK-sales_order-001",
      "sales_order_item": "Sample Sales Order Item",
      "material_request": "LINK-material_request-001",
      "material_request_item": "Sample material_request_item",
      "product_bundle_item": "LINK-product_bundle_item-001",
      "item_reference": "Sample Item Reference",
      "temporary_name": "Sample temporary name"
  };

  it('validates a correct Production Plan Item object', () => {
    const result = ProductionPlanItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProductionPlanItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = ProductionPlanItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProductionPlanItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
