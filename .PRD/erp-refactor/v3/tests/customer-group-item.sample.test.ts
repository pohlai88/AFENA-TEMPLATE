import { describe, it, expect } from 'vitest';
import { CustomerGroupItemSchema, CustomerGroupItemInsertSchema } from '../types/customer-group-item.js';

describe('CustomerGroupItem Zod validation', () => {
  const validSample = {
      "id": "TEST-CustomerGroupItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "customer_group": "LINK-customer_group-001"
  };

  it('validates a correct Customer Group Item object', () => {
    const result = CustomerGroupItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CustomerGroupItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CustomerGroupItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
