import { describe, it, expect } from 'vitest';
import { SubcontractingInwardOrderServiceItemSchema, SubcontractingInwardOrderServiceItemInsertSchema } from '../types/subcontracting-inward-order-service-item.js';

describe('SubcontractingInwardOrderServiceItem Zod validation', () => {
  const validSample = {
      "id": "TEST-SubcontractingInwardOrderServiceItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "qty": 1,
      "uom": "LINK-uom-001",
      "rate": 100,
      "amount": 100,
      "fg_item": "LINK-fg_item-001",
      "fg_item_qty": "1",
      "sales_order_item": "Sample Sales Order Item"
  };

  it('validates a correct Subcontracting Inward Order Service Item object', () => {
    const result = SubcontractingInwardOrderServiceItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubcontractingInwardOrderServiceItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = SubcontractingInwardOrderServiceItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubcontractingInwardOrderServiceItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
