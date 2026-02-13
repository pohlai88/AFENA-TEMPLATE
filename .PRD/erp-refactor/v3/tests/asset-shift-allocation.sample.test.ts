import { describe, it, expect } from 'vitest';
import { AssetShiftAllocationSchema, AssetShiftAllocationInsertSchema } from '../types/asset-shift-allocation.js';

describe('AssetShiftAllocation Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetShiftAllocation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "asset": "LINK-asset-001",
      "naming_series": "Option1",
      "finance_book": "LINK-finance_book-001",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Asset Shift Allocation object', () => {
    const result = AssetShiftAllocationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetShiftAllocationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "asset" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).asset;
    const result = AssetShiftAllocationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetShiftAllocationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
