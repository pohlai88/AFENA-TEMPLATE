import { describe, it, expect } from 'vitest';
import { TransactionDeletionRecordDetailsSchema, TransactionDeletionRecordDetailsInsertSchema } from '../types/transaction-deletion-record-details.js';

describe('TransactionDeletionRecordDetails Zod validation', () => {
  const validSample = {
      "id": "TEST-TransactionDeletionRecordDetails-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "doctype_name": "LINK-doctype_name-001",
      "docfield_name": "Sample DocField",
      "no_of_docs": 1,
      "done": "0"
  };

  it('validates a correct Transaction Deletion Record Details object', () => {
    const result = TransactionDeletionRecordDetailsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TransactionDeletionRecordDetailsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "doctype_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).doctype_name;
    const result = TransactionDeletionRecordDetailsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TransactionDeletionRecordDetailsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
