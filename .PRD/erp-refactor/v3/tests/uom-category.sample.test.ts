import { describe, it, expect } from 'vitest';
import { UomCategorySchema, UomCategoryInsertSchema } from '../types/uom-category.js';

describe('UomCategory Zod validation', () => {
  const validSample = {
      "id": "TEST-UomCategory-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "category_name": "Sample Category Name"
  };

  it('validates a correct UOM Category object', () => {
    const result = UomCategorySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = UomCategoryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "category_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).category_name;
    const result = UomCategorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = UomCategorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
