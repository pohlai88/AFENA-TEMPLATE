import { describe, it, expect } from 'vitest';
import { CustomerGroupSchema, CustomerGroupInsertSchema } from '../types/customer-group.js';

describe('CustomerGroup Zod validation', () => {
  const validSample = {
      "id": "TEST-CustomerGroup-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "customer_group_name": "Sample Customer Group Name",
      "parent_customer_group": "LINK-parent_customer_group-001",
      "is_group": "0",
      "default_price_list": "LINK-default_price_list-001",
      "payment_terms": "LINK-payment_terms-001",
      "lft": 1,
      "rgt": 1,
      "old_parent": "LINK-old_parent-001"
  };

  it('validates a correct Customer Group object', () => {
    const result = CustomerGroupSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CustomerGroupInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "customer_group_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).customer_group_name;
    const result = CustomerGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CustomerGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
