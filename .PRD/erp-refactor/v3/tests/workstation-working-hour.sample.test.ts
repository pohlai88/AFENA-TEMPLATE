import { describe, it, expect } from 'vitest';
import { WorkstationWorkingHourSchema, WorkstationWorkingHourInsertSchema } from '../types/workstation-working-hour.js';

describe('WorkstationWorkingHour Zod validation', () => {
  const validSample = {
      "id": "TEST-WorkstationWorkingHour-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "start_time": "10:30:00",
      "hours": 1,
      "end_time": "10:30:00",
      "enabled": "1"
  };

  it('validates a correct Workstation Working Hour object', () => {
    const result = WorkstationWorkingHourSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = WorkstationWorkingHourInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "start_time" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).start_time;
    const result = WorkstationWorkingHourSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = WorkstationWorkingHourSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
