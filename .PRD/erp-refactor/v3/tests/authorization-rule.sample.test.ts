import { describe, it, expect } from 'vitest';
import { AuthorizationRuleSchema, AuthorizationRuleInsertSchema } from '../types/authorization-rule.js';

describe('AuthorizationRule Zod validation', () => {
  const validSample = {
      "id": "TEST-AuthorizationRule-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "transaction": "Sales Order",
      "based_on": "Grand Total",
      "customer_or_item": "Customer",
      "master_name": "LINK-master_name-001",
      "company": "LINK-company-001",
      "value": 1,
      "system_role": "LINK-system_role-001",
      "to_emp": "LINK-to_emp-001",
      "system_user": "LINK-system_user-001",
      "to_designation": "LINK-to_designation-001",
      "approving_role": "LINK-approving_role-001",
      "approving_user": "LINK-approving_user-001"
  };

  it('validates a correct Authorization Rule object', () => {
    const result = AuthorizationRuleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AuthorizationRuleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "transaction" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).transaction;
    const result = AuthorizationRuleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AuthorizationRuleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
