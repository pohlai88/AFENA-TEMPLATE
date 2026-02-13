import { describe, it, expect } from 'vitest';
import { ProductBundleSchema, ProductBundleInsertSchema } from '../types/product-bundle.js';

describe('ProductBundle Zod validation', () => {
  const validSample = {
      "id": "TEST-ProductBundle-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "new_item_code": "LINK-new_item_code-001",
      "description": "Sample Description",
      "disabled": "0",
      "about": "Sample text for about"
  };

  it('validates a correct Product Bundle object', () => {
    const result = ProductBundleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProductBundleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "new_item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).new_item_code;
    const result = ProductBundleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProductBundleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
