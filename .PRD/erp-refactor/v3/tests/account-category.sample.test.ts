import { describe, it, expect } from 'vitest';
import { AccountCategorySchema, AccountCategoryInsertSchema } from '../types/account-category.js';

describe('AccountCategory Zod validation', () => {
  const validSample = {
      "id": "TEST-AccountCategory-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account_category_name": "Sample Account Category Name",
      "description": "Sample text for description"
  };

  it('validates a correct Account Category object', () => {
    const result = AccountCategorySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AccountCategoryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "account_category_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).account_category_name;
    const result = AccountCategorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AccountCategorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
