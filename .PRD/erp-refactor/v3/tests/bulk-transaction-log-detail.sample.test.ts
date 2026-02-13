import { describe, it, expect } from 'vitest';
import { BulkTransactionLogDetailSchema, BulkTransactionLogDetailInsertSchema } from '../types/bulk-transaction-log-detail.js';

describe('BulkTransactionLogDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-BulkTransactionLogDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "from_doctype": "LINK-from_doctype-001",
      "transaction_name": "LINK-transaction_name-001",
      "date": "2024-01-15",
      "time": "10:30:00",
      "transaction_status": "Sample Status",
      "error_description": "Sample text for error_description",
      "to_doctype": "LINK-to_doctype-001",
      "retried": 1
  };

  it('validates a correct Bulk Transaction Log Detail object', () => {
    const result = BulkTransactionLogDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BulkTransactionLogDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BulkTransactionLogDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
