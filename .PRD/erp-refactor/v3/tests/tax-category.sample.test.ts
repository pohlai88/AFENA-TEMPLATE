import { describe, it, expect } from 'vitest';
import { TaxCategorySchema, TaxCategoryInsertSchema } from '../types/tax-category.js';

describe('TaxCategory Zod validation', () => {
  const validSample = {
      "id": "TEST-TaxCategory-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "title": "Sample Title",
      "disabled": "0"
  };

  it('validates a correct Tax Category object', () => {
    const result = TaxCategorySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TaxCategoryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "title" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).title;
    const result = TaxCategorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TaxCategorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
