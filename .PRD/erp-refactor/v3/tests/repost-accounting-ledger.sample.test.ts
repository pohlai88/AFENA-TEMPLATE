import { describe, it, expect } from 'vitest';
import { RepostAccountingLedgerSchema, RepostAccountingLedgerInsertSchema } from '../types/repost-accounting-ledger.js';

describe('RepostAccountingLedger Zod validation', () => {
  const validSample = {
      "id": "TEST-RepostAccountingLedger-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "company": "LINK-company-001",
      "delete_cancelled_entries": "0",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Repost Accounting Ledger object', () => {
    const result = RepostAccountingLedgerSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = RepostAccountingLedgerInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = RepostAccountingLedgerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
