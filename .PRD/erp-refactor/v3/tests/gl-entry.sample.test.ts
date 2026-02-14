import { describe, it, expect } from 'vitest';
import { GlEntrySchema, GlEntryInsertSchema } from '../types/gl-entry.js';

describe('GlEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-GlEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "posting_date": "2024-01-15",
      "transaction_date": "2024-01-15",
      "fiscal_year": "LINK-fiscal_year-001",
      "due_date": "2024-01-15",
      "account": "LINK-account-001",
      "account_currency": "LINK-account_currency-001",
      "against": "Sample text for against",
      "party_type": "LINK-party_type-001",
      "party": "LINK-party-001",
      "voucher_type": "LINK-voucher_type-001",
      "voucher_no": "LINK-voucher_no-001",
      "voucher_subtype": "Sample text for voucher_subtype",
      "transaction_currency": "LINK-transaction_currency-001",
      "against_voucher_type": "LINK-against_voucher_type-001",
      "against_voucher": "LINK-against_voucher-001",
      "voucher_detail_no": "Sample Voucher Detail No",
      "transaction_exchange_rate": 1,
      "reporting_currency_exchange_rate": 1,
      "debit_in_account_currency": 100,
      "debit": 100,
      "debit_in_transaction_currency": 100,
      "debit_in_reporting_currency": 100,
      "credit_in_account_currency": 100,
      "credit": 100,
      "credit_in_transaction_currency": 100,
      "credit_in_reporting_currency": 100,
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "finance_book": "LINK-finance_book-001",
      "company": "LINK-company-001",
      "is_opening": "No",
      "is_advance": "No",
      "to_rename": "1",
      "is_cancelled": "0",
      "remarks": "Sample text for remarks"
  };

  it('validates a correct GL Entry object', () => {
    const result = GlEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = GlEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = GlEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
