import { describe, it, expect } from 'vitest';
import { SupplierItemSchema, SupplierItemInsertSchema } from '../types/supplier-item.js';

describe('SupplierItem Zod validation', () => {
  const validSample = {
      "id": "TEST-SupplierItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "supplier": "LINK-supplier-001"
  };

  it('validates a correct Supplier Item object', () => {
    const result = SupplierItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupplierItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupplierItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
