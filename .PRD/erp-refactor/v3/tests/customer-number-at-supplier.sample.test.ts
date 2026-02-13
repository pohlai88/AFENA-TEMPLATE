import { describe, it, expect } from 'vitest';
import { CustomerNumberAtSupplierSchema, CustomerNumberAtSupplierInsertSchema } from '../types/customer-number-at-supplier.js';

describe('CustomerNumberAtSupplier Zod validation', () => {
  const validSample = {
      "id": "TEST-CustomerNumberAtSupplier-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "customer_number": "Sample Customer Number"
  };

  it('validates a correct Customer Number At Supplier object', () => {
    const result = CustomerNumberAtSupplierSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CustomerNumberAtSupplierInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CustomerNumberAtSupplierSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
