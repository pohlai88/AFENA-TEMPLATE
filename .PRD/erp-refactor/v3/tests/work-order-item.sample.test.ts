import { describe, it, expect } from 'vitest';
import { WorkOrderItemSchema, WorkOrderItemInsertSchema } from '../types/work-order-item.js';

describe('WorkOrderItem Zod validation', () => {
  const validSample = {
      "id": "TEST-WorkOrderItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "operation": "LINK-operation-001",
      "item_code": "LINK-item_code-001",
      "source_warehouse": "LINK-source_warehouse-001",
      "operation_row_id": 1,
      "item_name": "Sample Item Name",
      "description": "Sample text for description",
      "allow_alternative_item": "0",
      "include_item_in_manufacturing": "0",
      "required_qty": 1,
      "stock_uom": "LINK-stock_uom-001",
      "rate": 100,
      "amount": 100,
      "transferred_qty": 1,
      "consumed_qty": 1,
      "returned_qty": 1,
      "available_qty_at_source_warehouse": 1,
      "available_qty_at_wip_warehouse": 1,
      "stock_reserved_qty": 1,
      "is_additional_item": "0",
      "is_customer_provided_item": "0",
      "voucher_detail_reference": "Sample Voucher Detail Reference"
  };

  it('validates a correct Work Order Item object', () => {
    const result = WorkOrderItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = WorkOrderItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = WorkOrderItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
