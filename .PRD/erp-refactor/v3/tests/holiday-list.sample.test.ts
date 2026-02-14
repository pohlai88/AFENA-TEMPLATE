import { describe, it, expect } from 'vitest';
import { HolidayListSchema, HolidayListInsertSchema } from '../types/holiday-list.js';

describe('HolidayList Zod validation', () => {
  const validSample = {
      "id": "TEST-HolidayList-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "holiday_list_name": "Sample Holiday List Name",
      "from_date": "2024-01-15",
      "to_date": "2024-01-15",
      "total_holidays": 1,
      "weekly_off": "Sunday",
      "is_half_day": "0",
      "country": "Sample Country",
      "subdivision": "Sample Subdivision",
      "color": "#3498db"
  };

  it('validates a correct Holiday List object', () => {
    const result = HolidayListSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = HolidayListInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "holiday_list_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).holiday_list_name;
    const result = HolidayListSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = HolidayListSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
