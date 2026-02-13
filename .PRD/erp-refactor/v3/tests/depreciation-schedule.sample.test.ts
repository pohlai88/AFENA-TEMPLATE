import { describe, it, expect } from 'vitest';
import { DepreciationScheduleSchema, DepreciationScheduleInsertSchema } from '../types/depreciation-schedule.js';

describe('DepreciationSchedule Zod validation', () => {
  const validSample = {
      "id": "TEST-DepreciationSchedule-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "schedule_date": "2024-01-15",
      "depreciation_amount": 100,
      "accumulated_depreciation_amount": 100,
      "journal_entry": "LINK-journal_entry-001",
      "shift": "LINK-shift-001"
  };

  it('validates a correct Depreciation Schedule object', () => {
    const result = DepreciationScheduleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DepreciationScheduleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "schedule_date" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).schedule_date;
    const result = DepreciationScheduleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DepreciationScheduleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
