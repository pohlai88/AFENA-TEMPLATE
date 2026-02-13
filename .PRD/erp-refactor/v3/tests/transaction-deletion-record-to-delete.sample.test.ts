import { describe, it, expect } from 'vitest';
import { TransactionDeletionRecordToDeleteSchema, TransactionDeletionRecordToDeleteInsertSchema } from '../types/transaction-deletion-record-to-delete.js';

describe('TransactionDeletionRecordToDelete Zod validation', () => {
  const validSample = {
      "id": "TEST-TransactionDeletionRecordToDelete-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "doctype_name": "LINK-doctype_name-001",
      "company_field": "Sample Company Field",
      "document_count": 1,
      "child_doctypes": "Sample text for child_doctypes",
      "deleted": "0"
  };

  it('validates a correct Transaction Deletion Record To Delete object', () => {
    const result = TransactionDeletionRecordToDeleteSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TransactionDeletionRecordToDeleteInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TransactionDeletionRecordToDeleteSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
