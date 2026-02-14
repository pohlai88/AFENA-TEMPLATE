import { describe, it, expect } from 'vitest';
import { RepostAccountingLedgerItemsSchema, RepostAccountingLedgerItemsInsertSchema } from '../types/repost-accounting-ledger-items.js';

describe('RepostAccountingLedgerItems Zod validation', () => {
  const validSample = {
      "id": "TEST-RepostAccountingLedgerItems-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "voucher_type": "LINK-voucher_type-001",
      "voucher_no": "LINK-voucher_no-001"
  };

  it('validates a correct Repost Accounting Ledger Items object', () => {
    const result = RepostAccountingLedgerItemsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = RepostAccountingLedgerItemsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = RepostAccountingLedgerItemsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
