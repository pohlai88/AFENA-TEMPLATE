import { describe, it, expect } from 'vitest';
import { BinSchema, BinInsertSchema } from '../types/bin.js';

describe('Bin Zod validation', () => {
  const validSample = {
      "id": "TEST-Bin-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "warehouse": "LINK-warehouse-001",
      "actual_qty": "0.00",
      "planned_qty": 1,
      "indented_qty": "0.00",
      "ordered_qty": "0.00",
      "reserved_qty": "0.00",
      "reserved_qty_for_production": 1,
      "reserved_qty_for_sub_contract": 1,
      "reserved_qty_for_production_plan": 1,
      "projected_qty": 1,
      "reserved_stock": "0",
      "stock_uom": "LINK-stock_uom-001",
      "company": "LINK-company-001",
      "valuation_rate": 1,
      "stock_value": 1
  };

  it('validates a correct Bin object', () => {
    const result = BinSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BinInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = BinSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BinSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
