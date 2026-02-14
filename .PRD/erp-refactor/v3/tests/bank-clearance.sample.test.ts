import { describe, it, expect } from 'vitest';
import { BankClearanceSchema, BankClearanceInsertSchema } from '../types/bank-clearance.js';

describe('BankClearance Zod validation', () => {
  const validSample = {
      "id": "TEST-BankClearance-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account": "LINK-account-001",
      "account_currency": "LINK-account_currency-001",
      "from_date": "2024-01-15",
      "to_date": "2024-01-15",
      "bank_account": "LINK-bank_account-001",
      "include_reconciled_entries": "0",
      "include_pos_transactions": "0"
  };

  it('validates a correct Bank Clearance object', () => {
    const result = BankClearanceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BankClearanceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "account" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).account;
    const result = BankClearanceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BankClearanceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
