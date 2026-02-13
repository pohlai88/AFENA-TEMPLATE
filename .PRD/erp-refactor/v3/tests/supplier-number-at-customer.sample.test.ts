import { describe, it, expect } from 'vitest';
import { SupplierNumberAtCustomerSchema, SupplierNumberAtCustomerInsertSchema } from '../types/supplier-number-at-customer.js';

describe('SupplierNumberAtCustomer Zod validation', () => {
  const validSample = {
      "id": "TEST-SupplierNumberAtCustomer-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "supplier_number": "Sample Supplier Number"
  };

  it('validates a correct Supplier Number At Customer object', () => {
    const result = SupplierNumberAtCustomerSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupplierNumberAtCustomerInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupplierNumberAtCustomerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
