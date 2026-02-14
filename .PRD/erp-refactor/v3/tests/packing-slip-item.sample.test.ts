import { describe, it, expect } from 'vitest';
import { PackingSlipItemSchema, PackingSlipItemInsertSchema } from '../types/packing-slip-item.js';

describe('PackingSlipItem Zod validation', () => {
  const validSample = {
      "id": "TEST-PackingSlipItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "batch_no": "LINK-batch_no-001",
      "description": "Sample text for description",
      "qty": 1,
      "net_weight": 1,
      "stock_uom": "LINK-stock_uom-001",
      "weight_uom": "LINK-weight_uom-001",
      "page_break": "0",
      "dn_detail": "Sample Delivery Note Item",
      "pi_detail": "Sample Delivery Note Packed Item"
  };

  it('validates a correct Packing Slip Item object', () => {
    const result = PackingSlipItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PackingSlipItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = PackingSlipItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PackingSlipItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
