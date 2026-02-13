import { describe, it, expect } from 'vitest';
import { ProcessStatementOfAccountsCustomerSchema, ProcessStatementOfAccountsCustomerInsertSchema } from '../types/process-statement-of-accounts-customer.js';

describe('ProcessStatementOfAccountsCustomer Zod validation', () => {
  const validSample = {
      "id": "TEST-ProcessStatementOfAccountsCustomer-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "customer": "LINK-customer-001",
      "customer_name": "Sample Customer Name",
      "billing_email": "Sample Billing Email",
      "primary_email": "Read Only Value"
  };

  it('validates a correct Process Statement Of Accounts Customer object', () => {
    const result = ProcessStatementOfAccountsCustomerSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProcessStatementOfAccountsCustomerInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "customer" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).customer;
    const result = ProcessStatementOfAccountsCustomerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProcessStatementOfAccountsCustomerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
