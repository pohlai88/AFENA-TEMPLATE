import { describe, it, expect } from 'vitest';
import { BulkTransactionLogSchema, BulkTransactionLogInsertSchema } from '../types/bulk-transaction-log.js';

describe('BulkTransactionLog Zod validation', () => {
  const validSample = {
      "id": "TEST-BulkTransactionLog-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "date": "2024-01-15",
      "log_entries": 1,
      "succeeded": 1,
      "failed": 1
  };

  it('validates a correct Bulk Transaction Log object', () => {
    const result = BulkTransactionLogSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BulkTransactionLogInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BulkTransactionLogSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
