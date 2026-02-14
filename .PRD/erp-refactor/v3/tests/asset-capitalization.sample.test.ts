import { describe, it, expect } from 'vitest';
import { AssetCapitalizationSchema, AssetCapitalizationInsertSchema } from '../types/asset-capitalization.js';

describe('AssetCapitalization Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetCapitalization-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "title": "Sample Title",
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "target_asset": "LINK-target_asset-001",
      "target_asset_name": "Sample Asset Name",
      "finance_book": "LINK-finance_book-001",
      "posting_date": "Today",
      "posting_time": "Now",
      "set_posting_time": "0",
      "target_item_code": "LINK-target_item_code-001",
      "amended_from": "LINK-amended_from-001",
      "stock_items_total": 100,
      "asset_items_total": 100,
      "service_items_total": 100,
      "total_value": 100,
      "target_incoming_rate": 100,
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "target_fixed_asset_account": "LINK-target_fixed_asset_account-001"
  };

  it('validates a correct Asset Capitalization object', () => {
    const result = AssetCapitalizationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetCapitalizationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = AssetCapitalizationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetCapitalizationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
