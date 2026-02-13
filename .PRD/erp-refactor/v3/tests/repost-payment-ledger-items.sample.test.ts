import { describe, it, expect } from 'vitest';
import { RepostPaymentLedgerItemsSchema, RepostPaymentLedgerItemsInsertSchema } from '../types/repost-payment-ledger-items.js';

describe('RepostPaymentLedgerItems Zod validation', () => {
  const validSample = {
      "id": "TEST-RepostPaymentLedgerItems-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "voucher_type": "LINK-voucher_type-001",
      "voucher_no": "LINK-voucher_no-001"
  };

  it('validates a correct Repost Payment Ledger Items object', () => {
    const result = RepostPaymentLedgerItemsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = RepostPaymentLedgerItemsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = RepostPaymentLedgerItemsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
