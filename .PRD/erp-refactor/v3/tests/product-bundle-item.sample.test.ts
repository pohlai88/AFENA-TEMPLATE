import { describe, it, expect } from 'vitest';
import { ProductBundleItemSchema, ProductBundleItemInsertSchema } from '../types/product-bundle-item.js';

describe('ProductBundleItem Zod validation', () => {
  const validSample = {
      "id": "TEST-ProductBundleItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "qty": 1,
      "description": "Sample text for description",
      "rate": 1,
      "uom": "LINK-uom-001"
  };

  it('validates a correct Product Bundle Item object', () => {
    const result = ProductBundleItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProductBundleItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = ProductBundleItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProductBundleItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
