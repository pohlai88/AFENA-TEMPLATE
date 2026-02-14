import { describe, it, expect } from 'vitest';
import { LedgerMergeSchema, LedgerMergeInsertSchema } from '../types/ledger-merge.js';

describe('LedgerMerge Zod validation', () => {
  const validSample = {
      "id": "TEST-LedgerMerge-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "root_type": "Asset",
      "account": "LINK-account-001",
      "account_name": "Sample Account Name",
      "company": "LINK-company-001",
      "status": "Pending",
      "is_group": "0"
  };

  it('validates a correct Ledger Merge object', () => {
    const result = LedgerMergeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LedgerMergeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "root_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).root_type;
    const result = LedgerMergeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LedgerMergeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
