import { describe, it, expect } from 'vitest';
import { ItemCustomerDetailSchema, ItemCustomerDetailInsertSchema } from '../types/item-customer-detail.js';

describe('ItemCustomerDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemCustomerDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "customer_name": "LINK-customer_name-001",
      "customer_group": "LINK-customer_group-001",
      "ref_code": "Sample Ref Code"
  };

  it('validates a correct Item Customer Detail object', () => {
    const result = ItemCustomerDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemCustomerDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "ref_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).ref_code;
    const result = ItemCustomerDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemCustomerDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
