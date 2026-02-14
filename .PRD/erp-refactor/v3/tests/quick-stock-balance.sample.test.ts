import { describe, it, expect } from 'vitest';
import { QuickStockBalanceSchema, QuickStockBalanceInsertSchema } from '../types/quick-stock-balance.js';

describe('QuickStockBalance Zod validation', () => {
  const validSample = {
      "id": "TEST-QuickStockBalance-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "warehouse": "LINK-warehouse-001",
      "date": "Today",
      "item_barcode": "Sample Item Barcode",
      "item": "LINK-item-001",
      "item_name": "Sample Item Name",
      "item_description": "  ",
      "image": "/files/sample.png",
      "qty": 1,
      "value": 100
  };

  it('validates a correct Quick Stock Balance object', () => {
    const result = QuickStockBalanceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QuickStockBalanceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "warehouse" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).warehouse;
    const result = QuickStockBalanceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QuickStockBalanceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
