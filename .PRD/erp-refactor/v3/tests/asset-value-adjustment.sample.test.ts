import { describe, it, expect } from 'vitest';
import { AssetValueAdjustmentSchema, AssetValueAdjustmentInsertSchema } from '../types/asset-value-adjustment.js';

describe('AssetValueAdjustment Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetValueAdjustment-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "company": "LINK-company-001",
      "asset": "LINK-asset-001",
      "asset_category": "Read Only Value",
      "date": "2024-01-15",
      "finance_book": "LINK-finance_book-001",
      "amended_from": "LINK-amended_from-001",
      "current_asset_value": 100,
      "new_asset_value": 100,
      "difference_amount": 100,
      "difference_account": "LINK-difference_account-001",
      "journal_entry": "LINK-journal_entry-001",
      "cost_center": "LINK-cost_center-001"
  };

  it('validates a correct Asset Value Adjustment object', () => {
    const result = AssetValueAdjustmentSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetValueAdjustmentInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "asset" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).asset;
    const result = AssetValueAdjustmentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetValueAdjustmentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
