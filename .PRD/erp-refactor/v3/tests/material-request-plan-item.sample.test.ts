import { describe, it, expect } from 'vitest';
import { MaterialRequestPlanItemSchema, MaterialRequestPlanItemInsertSchema } from '../types/material-request-plan-item.js';

describe('MaterialRequestPlanItem Zod validation', () => {
  const validSample = {
      "id": "TEST-MaterialRequestPlanItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "from_warehouse": "LINK-from_warehouse-001",
      "warehouse": "LINK-warehouse-001",
      "material_request_type": "Purchase",
      "item_name": "Sample Item Name",
      "uom": "LINK-uom-001",
      "conversion_factor": 1,
      "from_bom": "LINK-from_bom-001",
      "main_item_code": "LINK-main_item_code-001",
      "required_bom_qty": 1,
      "projected_qty": 1,
      "quantity": 1,
      "stock_reserved_qty": 1,
      "schedule_date": "2024-01-15",
      "description": "Sample text for description",
      "min_order_qty": 1,
      "sales_order": "LINK-sales_order-001",
      "sub_assembly_item_reference": "Sample Sub Assembly Item Reference",
      "actual_qty": "0",
      "requested_qty": "0",
      "reserved_qty_for_production": 1,
      "ordered_qty": 1,
      "safety_stock": 1
  };

  it('validates a correct Material Request Plan Item object', () => {
    const result = MaterialRequestPlanItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = MaterialRequestPlanItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = MaterialRequestPlanItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = MaterialRequestPlanItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
