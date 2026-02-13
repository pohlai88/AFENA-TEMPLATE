import { describe, it, expect } from 'vitest';
import { LedgerMergeAccountsSchema, LedgerMergeAccountsInsertSchema } from '../types/ledger-merge-accounts.js';

describe('LedgerMergeAccounts Zod validation', () => {
  const validSample = {
      "id": "TEST-LedgerMergeAccounts-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account": "LINK-account-001",
      "account_name": "Sample Account Name",
      "merged": "0"
  };

  it('validates a correct Ledger Merge Accounts object', () => {
    const result = LedgerMergeAccountsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LedgerMergeAccountsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "account" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).account;
    const result = LedgerMergeAccountsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LedgerMergeAccountsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
