import { describe, it, expect } from 'vitest';
import { PosCustomerGroupSchema, PosCustomerGroupInsertSchema } from '../types/pos-customer-group.js';

describe('PosCustomerGroup Zod validation', () => {
  const validSample = {
      "id": "TEST-PosCustomerGroup-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "customer_group": "LINK-customer_group-001"
  };

  it('validates a correct POS Customer Group object', () => {
    const result = PosCustomerGroupSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosCustomerGroupInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "customer_group" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).customer_group;
    const result = PosCustomerGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosCustomerGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
