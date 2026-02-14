import { describe, it, expect } from 'vitest';
import { BlanketOrderItemSchema, BlanketOrderItemInsertSchema } from '../types/blanket-order-item.js';

describe('BlanketOrderItem Zod validation', () => {
  const validSample = {
      "id": "TEST-BlanketOrderItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "party_item_code": "Sample Party Item Code",
      "qty": 1,
      "rate": 100,
      "ordered_qty": 1,
      "terms_and_conditions": "Sample text for terms_and_conditions"
  };

  it('validates a correct Blanket Order Item object', () => {
    const result = BlanketOrderItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BlanketOrderItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = BlanketOrderItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BlanketOrderItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
