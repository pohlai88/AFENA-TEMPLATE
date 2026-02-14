import { describe, it, expect } from 'vitest';
import { HolidaySchema, HolidayInsertSchema } from '../types/holiday.js';

describe('Holiday Zod validation', () => {
  const validSample = {
      "id": "TEST-Holiday-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "holiday_date": "2024-01-15",
      "weekly_off": "0",
      "description": "Sample text for description",
      "is_half_day": "0"
  };

  it('validates a correct Holiday object', () => {
    const result = HolidaySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = HolidayInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "holiday_date" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).holiday_date;
    const result = HolidaySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = HolidaySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
