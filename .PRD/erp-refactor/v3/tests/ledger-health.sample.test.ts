import { describe, it, expect } from 'vitest';
import { LedgerHealthSchema, LedgerHealthInsertSchema } from '../types/ledger-health.js';

describe('LedgerHealth Zod validation', () => {
  const validSample = {
      "id": "TEST-LedgerHealth-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "voucher_type": "Sample Voucher Type",
      "voucher_no": "Sample Voucher No",
      "checked_on": "2024-01-15T10:30:00.000Z",
      "debit_credit_mismatch": "0",
      "general_and_payment_ledger_mismatch": "0"
  };

  it('validates a correct Ledger Health object', () => {
    const result = LedgerHealthSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LedgerHealthInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LedgerHealthSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
