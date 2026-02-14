import { describe, it, expect } from 'vitest';
import { BankTransactionMappingSchema, BankTransactionMappingInsertSchema } from '../types/bank-transaction-mapping.js';

describe('BankTransactionMapping Zod validation', () => {
  const validSample = {
      "id": "TEST-BankTransactionMapping-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "bank_transaction_field": "Option1",
      "file_field": "Sample Column in Bank File"
  };

  it('validates a correct Bank Transaction Mapping object', () => {
    const result = BankTransactionMappingSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BankTransactionMappingInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "bank_transaction_field" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).bank_transaction_field;
    const result = BankTransactionMappingSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BankTransactionMappingSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
