import { describe, it, expect } from 'vitest';
import { AssetCategoryAccountSchema, AssetCategoryAccountInsertSchema } from '../types/asset-category-account.js';

describe('AssetCategoryAccount Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetCategoryAccount-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company_name": "LINK-company_name-001",
      "fixed_asset_account": "LINK-fixed_asset_account-001",
      "accumulated_depreciation_account": "LINK-accumulated_depreciation_account-001",
      "depreciation_expense_account": "LINK-depreciation_expense_account-001",
      "capital_work_in_progress_account": "LINK-capital_work_in_progress_account-001"
  };

  it('validates a correct Asset Category Account object', () => {
    const result = AssetCategoryAccountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetCategoryAccountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company_name;
    const result = AssetCategoryAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetCategoryAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
