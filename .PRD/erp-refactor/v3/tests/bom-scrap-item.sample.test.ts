import { describe, it, expect } from 'vitest';
import { BomScrapItemSchema, BomScrapItemInsertSchema } from '../types/bom-scrap-item.js';

describe('BomScrapItem Zod validation', () => {
  const validSample = {
      "id": "TEST-BomScrapItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "stock_qty": 1,
      "rate": 100,
      "amount": 100,
      "stock_uom": "LINK-stock_uom-001",
      "base_rate": 100,
      "base_amount": 100
  };

  it('validates a correct BOM Scrap Item object', () => {
    const result = BomScrapItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BomScrapItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = BomScrapItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BomScrapItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
