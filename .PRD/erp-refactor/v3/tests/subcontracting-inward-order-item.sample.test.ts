import { describe, it, expect } from 'vitest';
import { SubcontractingInwardOrderItemSchema, SubcontractingInwardOrderItemInsertSchema } from '../types/subcontracting-inward-order-item.js';

describe('SubcontractingInwardOrderItem Zod validation', () => {
  const validSample = {
      "id": "TEST-SubcontractingInwardOrderItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "bom": "LINK-bom-001",
      "delivery_warehouse": "LINK-delivery_warehouse-001",
      "include_exploded_items": "0",
      "qty": "1",
      "produced_qty": "0",
      "returned_qty": "0",
      "stock_uom": "LINK-stock_uom-001",
      "process_loss_qty": "0",
      "delivered_qty": "0",
      "conversion_factor": "1",
      "sales_order_item": "Sample Sales Order Item",
      "subcontracting_conversion_factor": 1
  };

  it('validates a correct Subcontracting Inward Order Item object', () => {
    const result = SubcontractingInwardOrderItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubcontractingInwardOrderItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = SubcontractingInwardOrderItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubcontractingInwardOrderItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
