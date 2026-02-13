import { describe, it, expect } from 'vitest';
import { ProductionPlanSubAssemblyItemSchema, ProductionPlanSubAssemblyItemInsertSchema } from '../types/production-plan-sub-assembly-item.js';

describe('ProductionPlanSubAssemblyItem Zod validation', () => {
  const validSample = {
      "id": "TEST-ProductionPlanSubAssemblyItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "production_item": "LINK-production_item-001",
      "item_name": "Sample Item Name",
      "fg_warehouse": "LINK-fg_warehouse-001",
      "parent_item_code": "LINK-parent_item_code-001",
      "bom_no": "LINK-bom_no-001",
      "bom_level": 1,
      "type_of_manufacturing": "In House",
      "required_qty": 1,
      "projected_qty": 1,
      "qty": 1,
      "supplier": "LINK-supplier-001",
      "purchase_order": "LINK-purchase_order-001",
      "production_plan_item": "Sample Production Plan Item",
      "wo_produced_qty": 1,
      "stock_reserved_qty": 1,
      "ordered_qty": 1,
      "received_qty": 1,
      "indent": 1,
      "schedule_date": "2024-01-15T10:30:00.000Z",
      "uom": "LINK-uom-001",
      "stock_uom": "LINK-stock_uom-001",
      "actual_qty": 1,
      "description": "Sample text for description"
  };

  it('validates a correct Production Plan Sub Assembly Item object', () => {
    const result = ProductionPlanSubAssemblyItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProductionPlanSubAssemblyItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProductionPlanSubAssemblyItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
