import { describe, it, expect } from 'vitest';
import { AssetDepreciationScheduleSchema, AssetDepreciationScheduleInsertSchema } from '../types/asset-depreciation-schedule.js';

describe('AssetDepreciationSchedule Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetDepreciationSchedule-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "asset": "LINK-asset-001",
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "net_purchase_amount": 100,
      "opening_accumulated_depreciation": 100,
      "opening_number_of_booked_depreciations": 1,
      "finance_book": "LINK-finance_book-001",
      "finance_book_id": 1,
      "depreciation_method": "Straight Line",
      "total_number_of_depreciations": 1,
      "rate_of_depreciation": 1,
      "daily_prorata_based": "0",
      "shift_based": "0",
      "frequency_of_depreciation": 1,
      "expected_value_after_useful_life": 100,
      "value_after_depreciation": 100,
      "notes": "Sample text for notes",
      "status": "Draft",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Asset Depreciation Schedule object', () => {
    const result = AssetDepreciationScheduleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetDepreciationScheduleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "asset" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).asset;
    const result = AssetDepreciationScheduleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetDepreciationScheduleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
