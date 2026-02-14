import { describe, it, expect } from 'vitest';
import { SupplierGroupSchema, SupplierGroupInsertSchema } from '../types/supplier-group.js';

describe('SupplierGroup Zod validation', () => {
  const validSample = {
      "id": "TEST-SupplierGroup-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "supplier_group_name": "Sample Supplier Group Name",
      "parent_supplier_group": "LINK-parent_supplier_group-001",
      "is_group": "0",
      "payment_terms": "LINK-payment_terms-001",
      "lft": 1,
      "rgt": 1,
      "old_parent": "LINK-old_parent-001"
  };

  it('validates a correct Supplier Group object', () => {
    const result = SupplierGroupSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupplierGroupInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "supplier_group_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).supplier_group_name;
    const result = SupplierGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupplierGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
