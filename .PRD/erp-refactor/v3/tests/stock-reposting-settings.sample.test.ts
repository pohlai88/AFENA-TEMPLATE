import { describe, it, expect } from 'vitest';
import { StockRepostingSettingsSchema, StockRepostingSettingsInsertSchema } from '../types/stock-reposting-settings.js';

describe('StockRepostingSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-StockRepostingSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "limit_reposting_timeslot": "0",
      "start_time": "10:30:00",
      "end_time": "10:30:00",
      "limits_dont_apply_on": "Monday",
      "item_based_reposting": "1",
      "enable_parallel_reposting": "0",
      "no_of_parallel_reposting": "4",
      "notify_reposting_error_to_role": "LINK-notify_reposting_error_to_role-001"
  };

  it('validates a correct Stock Reposting Settings object', () => {
    const result = StockRepostingSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = StockRepostingSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = StockRepostingSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
