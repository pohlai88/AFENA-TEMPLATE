import { describe, it, expect } from 'vitest';
import { FinanceBookSchema, FinanceBookInsertSchema } from '../types/finance-book.js';

describe('FinanceBook Zod validation', () => {
  const validSample = {
      "id": "TEST-FinanceBook-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "finance_book_name": "Sample Name"
  };

  it('validates a correct Finance Book object', () => {
    const result = FinanceBookSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = FinanceBookInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = FinanceBookSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
