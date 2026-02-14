import { describe, it, expect } from 'vitest';
import { SupplierGroupItemSchema, SupplierGroupItemInsertSchema } from '../types/supplier-group-item.js';

describe('SupplierGroupItem Zod validation', () => {
  const validSample = {
      "id": "TEST-SupplierGroupItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "supplier_group": "LINK-supplier_group-001"
  };

  it('validates a correct Supplier Group Item object', () => {
    const result = SupplierGroupItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupplierGroupItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupplierGroupItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
