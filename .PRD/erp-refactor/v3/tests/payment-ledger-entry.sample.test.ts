import { describe, it, expect } from 'vitest';
import { PaymentLedgerEntrySchema, PaymentLedgerEntryInsertSchema } from '../types/payment-ledger-entry.js';

describe('PaymentLedgerEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentLedgerEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "posting_date": "2024-01-15",
      "company": "LINK-company-001",
      "account_type": "Receivable",
      "account": "LINK-account-001",
      "party_type": "LINK-party_type-001",
      "party": "LINK-party-001",
      "due_date": "2024-01-15",
      "voucher_detail_no": "Sample Voucher Detail No",
      "cost_center": "LINK-cost_center-001",
      "finance_book": "LINK-finance_book-001",
      "voucher_type": "LINK-voucher_type-001",
      "voucher_no": "LINK-voucher_no-001",
      "against_voucher_type": "LINK-against_voucher_type-001",
      "against_voucher_no": "LINK-against_voucher_no-001",
      "amount": 100,
      "account_currency": "LINK-account_currency-001",
      "amount_in_account_currency": 100,
      "delinked": "0",
      "remarks": "Sample text for remarks",
      "project": "LINK-project-001"
  };

  it('validates a correct Payment Ledger Entry object', () => {
    const result = PaymentLedgerEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentLedgerEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentLedgerEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
