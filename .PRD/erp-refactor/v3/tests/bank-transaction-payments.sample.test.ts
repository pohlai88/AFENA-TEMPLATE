import { describe, it, expect } from 'vitest';
import { BankTransactionPaymentsSchema, BankTransactionPaymentsInsertSchema } from '../types/bank-transaction-payments.js';

describe('BankTransactionPayments Zod validation', () => {
  const validSample = {
      "id": "TEST-BankTransactionPayments-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "payment_document": "LINK-payment_document-001",
      "payment_entry": "LINK-payment_entry-001",
      "allocated_amount": 100,
      "clearance_date": "2024-01-15"
  };

  it('validates a correct Bank Transaction Payments object', () => {
    const result = BankTransactionPaymentsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BankTransactionPaymentsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "payment_document" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).payment_document;
    const result = BankTransactionPaymentsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BankTransactionPaymentsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
