import { describe, it, expect } from 'vitest';
import { TransactionDeletionRecordItemSchema, TransactionDeletionRecordItemInsertSchema } from '../types/transaction-deletion-record-item.js';

describe('TransactionDeletionRecordItem Zod validation', () => {
  const validSample = {
      "id": "TEST-TransactionDeletionRecordItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "doctype_name": "LINK-doctype_name-001"
  };

  it('validates a correct Transaction Deletion Record Item object', () => {
    const result = TransactionDeletionRecordItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TransactionDeletionRecordItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "doctype_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).doctype_name;
    const result = TransactionDeletionRecordItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TransactionDeletionRecordItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
