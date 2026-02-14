import { describe, it, expect } from 'vitest';
import { AssetCategorySchema, AssetCategoryInsertSchema } from '../types/asset-category.js';

describe('AssetCategory Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetCategory-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "asset_category_name": "Sample Asset Category Name",
      "enable_cwip_accounting": "0",
      "non_depreciable_category": "0"
  };

  it('validates a correct Asset Category object', () => {
    const result = AssetCategorySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetCategoryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "asset_category_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).asset_category_name;
    const result = AssetCategorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetCategorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
