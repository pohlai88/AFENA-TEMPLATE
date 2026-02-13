import { describe, it, expect } from 'vitest';
import { JournalEntryAccountSchema, JournalEntryAccountInsertSchema } from '../types/journal-entry-account.js';

describe('JournalEntryAccount Zod validation', () => {
  const validSample = {
      "id": "TEST-JournalEntryAccount-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account": "LINK-account-001",
      "account_type": "Sample Account Type",
      "bank_account": "LINK-bank_account-001",
      "party_type": "LINK-party_type-001",
      "party": "LINK-party-001",
      "cost_center": ":Company",
      "project": "LINK-project-001",
      "account_currency": "LINK-account_currency-001",
      "exchange_rate": 1,
      "debit_in_account_currency": 100,
      "debit": 100,
      "credit_in_account_currency": 100,
      "credit": 100,
      "reference_type": "Sales Invoice",
      "reference_name": "LINK-reference_name-001",
      "reference_due_date": "2024-01-15",
      "reference_detail_no": "Sample Reference Detail No",
      "advance_voucher_type": "LINK-advance_voucher_type-001",
      "advance_voucher_no": "LINK-advance_voucher_no-001",
      "is_tax_withholding_account": "0",
      "is_advance": "No",
      "user_remark": "Sample text for user_remark",
      "against_account": "Sample text for against_account"
  };

  it('validates a correct Journal Entry Account object', () => {
    const result = JournalEntryAccountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = JournalEntryAccountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "account" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).account;
    const result = JournalEntryAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = JournalEntryAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
