import { describe, it, expect } from 'vitest';
import { RepostAccountingLedgerSettingsSchema, RepostAccountingLedgerSettingsInsertSchema } from '../types/repost-accounting-ledger-settings.js';

describe('RepostAccountingLedgerSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-RepostAccountingLedgerSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator"
  };

  it('validates a correct Repost Accounting Ledger Settings object', () => {
    const result = RepostAccountingLedgerSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = RepostAccountingLedgerSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = RepostAccountingLedgerSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
