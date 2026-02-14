import { describe, it, expect } from 'vitest';
import { RepostPaymentLedgerSchema, RepostPaymentLedgerInsertSchema } from '../types/repost-payment-ledger.js';

describe('RepostPaymentLedger Zod validation', () => {
  const validSample = {
      "id": "TEST-RepostPaymentLedger-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "company": "LINK-company-001",
      "posting_date": "Today",
      "voucher_type": "LINK-voucher_type-001",
      "add_manually": "0",
      "repost_status": "Queued",
      "repost_error_log": "Sample text for repost_error_log",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Repost Payment Ledger object', () => {
    const result = RepostPaymentLedgerSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = RepostPaymentLedgerInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = RepostPaymentLedgerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = RepostPaymentLedgerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
