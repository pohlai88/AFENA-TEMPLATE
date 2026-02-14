import { describe, it, expect } from 'vitest';
import { AssetFinanceBookSchema, AssetFinanceBookInsertSchema } from '../types/asset-finance-book.js';

describe('AssetFinanceBook Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetFinanceBook-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "finance_book": "LINK-finance_book-001",
      "depreciation_method": "Straight Line",
      "frequency_of_depreciation": 1,
      "total_number_of_depreciations": 1,
      "increase_in_asset_life": 1,
      "depreciation_start_date": "2024-01-15",
      "salvage_value_percentage": 1,
      "expected_value_after_useful_life": "0",
      "rate_of_depreciation": 1,
      "daily_prorata_based": "0",
      "shift_based": "0",
      "value_after_depreciation": 100,
      "total_number_of_booked_depreciations": "0"
  };

  it('validates a correct Asset Finance Book object', () => {
    const result = AssetFinanceBookSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetFinanceBookInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "depreciation_method" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).depreciation_method;
    const result = AssetFinanceBookSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetFinanceBookSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
