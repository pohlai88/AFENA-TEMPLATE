import { describe, it, expect } from 'vitest';
import { AssetCapitalizationAssetItemSchema, AssetCapitalizationAssetItemInsertSchema } from '../types/asset-capitalization-asset-item.js';

describe('AssetCapitalizationAssetItem Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetCapitalizationAssetItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "asset": "LINK-asset-001",
      "asset_name": "Sample Asset Name",
      "finance_book": "LINK-finance_book-001",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "current_asset_value": 100,
      "asset_value": "0",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "fixed_asset_account": "LINK-fixed_asset_account-001"
  };

  it('validates a correct Asset Capitalization Asset Item object', () => {
    const result = AssetCapitalizationAssetItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetCapitalizationAssetItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "asset" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).asset;
    const result = AssetCapitalizationAssetItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetCapitalizationAssetItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
