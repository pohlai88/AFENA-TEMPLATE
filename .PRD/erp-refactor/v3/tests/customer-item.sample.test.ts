import { describe, it, expect } from 'vitest';
import { CustomerItemSchema, CustomerItemInsertSchema } from '../types/customer-item.js';

describe('CustomerItem Zod validation', () => {
  const validSample = {
      "id": "TEST-CustomerItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "customer": "LINK-customer-001"
  };

  it('validates a correct Customer Item object', () => {
    const result = CustomerItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CustomerItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CustomerItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
