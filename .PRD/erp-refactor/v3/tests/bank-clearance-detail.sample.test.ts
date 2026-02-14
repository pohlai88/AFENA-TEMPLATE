import { describe, it, expect } from 'vitest';
import { BankClearanceDetailSchema, BankClearanceDetailInsertSchema } from '../types/bank-clearance-detail.js';

describe('BankClearanceDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-BankClearanceDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "payment_document": "LINK-payment_document-001",
      "payment_entry": "LINK-payment_entry-001",
      "against_account": "Sample Against Account",
      "amount": "Sample Amount",
      "posting_date": "2024-01-15",
      "cheque_number": "Sample Cheque Number",
      "cheque_date": "2024-01-15",
      "clearance_date": "2024-01-15"
  };

  it('validates a correct Bank Clearance Detail object', () => {
    const result = BankClearanceDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BankClearanceDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BankClearanceDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
