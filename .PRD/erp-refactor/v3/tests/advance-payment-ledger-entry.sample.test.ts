import { describe, it, expect } from 'vitest';
import { AdvancePaymentLedgerEntrySchema, AdvancePaymentLedgerEntryInsertSchema } from '../types/advance-payment-ledger-entry.js';

describe('AdvancePaymentLedgerEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-AdvancePaymentLedgerEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "voucher_type": "LINK-voucher_type-001",
      "voucher_no": "LINK-voucher_no-001",
      "against_voucher_type": "LINK-against_voucher_type-001",
      "against_voucher_no": "LINK-against_voucher_no-001",
      "currency": "LINK-currency-001",
      "exchange_rate": 1,
      "amount": 100,
      "base_amount": 100,
      "event": "Sample Event",
      "delinked": "0"
  };

  it('validates a correct Advance Payment Ledger Entry object', () => {
    const result = AdvancePaymentLedgerEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AdvancePaymentLedgerEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AdvancePaymentLedgerEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
