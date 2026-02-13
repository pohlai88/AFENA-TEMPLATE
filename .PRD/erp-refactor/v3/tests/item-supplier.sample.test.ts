import { describe, it, expect } from 'vitest';
import { ItemSupplierSchema, ItemSupplierInsertSchema } from '../types/item-supplier.js';

describe('ItemSupplier Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemSupplier-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "supplier": "LINK-supplier-001",
      "supplier_part_no": "Sample Supplier Part Number"
  };

  it('validates a correct Item Supplier object', () => {
    const result = ItemSupplierSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemSupplierInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "supplier" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).supplier;
    const result = ItemSupplierSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemSupplierSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
