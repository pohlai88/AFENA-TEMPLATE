import { describe, it, expect } from 'vitest';
import { SubcontractingOrderItemSchema, SubcontractingOrderItemInsertSchema } from '../types/subcontracting-order-item.js';

describe('SubcontractingOrderItem Zod validation', () => {
  const validSample = {
      "id": "TEST-SubcontractingOrderItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "bom": "LINK-bom-001",
      "include_exploded_items": "0",
      "schedule_date": "2024-01-15",
      "expected_delivery_date": "2024-01-15",
      "description": "Sample text for description",
      "image": "/files/sample.png",
      "image_view": "/files/sample.png",
      "qty": "1",
      "received_qty": 1,
      "returned_qty": 1,
      "stock_uom": "LINK-stock_uom-001",
      "conversion_factor": "1",
      "rate": 100,
      "amount": 100,
      "rm_cost_per_qty": 100,
      "service_cost_per_qty": 100,
      "additional_cost_per_qty": "0",
      "warehouse": "LINK-warehouse-001",
      "expense_account": "LINK-expense_account-001",
      "manufacturer": "LINK-manufacturer-001",
      "manufacturer_part_no": "Sample Manufacturer Part Number",
      "material_request": "LINK-material_request-001",
      "material_request_item": "Sample Material Request Item",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "job_card": "LINK-job_card-001",
      "purchase_order_item": "Sample Purchase Order Item",
      "page_break": "0",
      "subcontracting_conversion_factor": 1,
      "production_plan_sub_assembly_item": "Sample Production Plan Sub Assembly Item"
  };

  it('validates a correct Subcontracting Order Item object', () => {
    const result = SubcontractingOrderItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubcontractingOrderItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = SubcontractingOrderItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubcontractingOrderItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
