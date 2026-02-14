import { describe, it, expect } from 'vitest';
import { SubcontractingOrderSuppliedItemSchema, SubcontractingOrderSuppliedItemInsertSchema } from '../types/subcontracting-order-supplied-item.js';

describe('SubcontractingOrderSuppliedItem Zod validation', () => {
  const validSample = {
      "id": "TEST-SubcontractingOrderSuppliedItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "main_item_code": "LINK-main_item_code-001",
      "rm_item_code": "LINK-rm_item_code-001",
      "stock_uom": "LINK-stock_uom-001",
      "conversion_factor": "1",
      "reserve_warehouse": "LINK-reserve_warehouse-001",
      "bom_detail_no": "Sample BOM Detail No",
      "reference_name": "Sample Reference Name",
      "rate": 100,
      "amount": 100,
      "required_qty": 1,
      "supplied_qty": 1,
      "stock_reserved_qty": "0",
      "consumed_qty": 1,
      "returned_qty": 1,
      "total_supplied_qty": 1
  };

  it('validates a correct Subcontracting Order Supplied Item object', () => {
    const result = SubcontractingOrderSuppliedItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubcontractingOrderSuppliedItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubcontractingOrderSuppliedItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
