import { describe, it, expect } from 'vitest';
import { MaterialRequestItemSchema, MaterialRequestItemInsertSchema } from '../types/material-request-item.js';

describe('MaterialRequestItem Zod validation', () => {
  const validSample = {
      "id": "TEST-MaterialRequestItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "schedule_date": "2024-01-15",
      "description": "Sample text for description",
      "item_group": "LINK-item_group-001",
      "brand": "LINK-brand-001",
      "image": "/files/sample.png",
      "qty": 1,
      "stock_uom": "LINK-stock_uom-001",
      "from_warehouse": "LINK-from_warehouse-001",
      "warehouse": "LINK-warehouse-001",
      "uom": "LINK-uom-001",
      "conversion_factor": 1,
      "stock_qty": 1,
      "min_order_qty": 1,
      "projected_qty": 1,
      "picked_qty": 1,
      "actual_qty": 1,
      "ordered_qty": 1,
      "received_qty": 1,
      "rate": 100,
      "price_list_rate": 100,
      "amount": 100,
      "expense_account": "LINK-expense_account-001",
      "wip_composite_asset": "LINK-wip_composite_asset-001",
      "manufacturer": "LINK-manufacturer-001",
      "manufacturer_part_no": "Sample Manufacturer Part Number",
      "bom_no": "LINK-bom_no-001",
      "project": "LINK-project-001",
      "cost_center": "LINK-cost_center-001",
      "lead_time_date": "2024-01-15",
      "sales_order": "LINK-sales_order-001",
      "sales_order_item": "Sample Sales Order Item",
      "packed_item": "Sample Packed Item",
      "production_plan": "LINK-production_plan-001",
      "material_request_plan_item": "Sample Material Request Plan Item",
      "job_card_item": "Sample Job Card Item",
      "projected_on_hand": 1,
      "reorder_level": 1,
      "reorder_qty": 1,
      "page_break": "0"
  };

  it('validates a correct Material Request Item object', () => {
    const result = MaterialRequestItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = MaterialRequestItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = MaterialRequestItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = MaterialRequestItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
