import { describe, it, expect } from 'vitest';
import { IncomingCallHandlingScheduleSchema, IncomingCallHandlingScheduleInsertSchema } from '../types/incoming-call-handling-schedule.js';

describe('IncomingCallHandlingSchedule Zod validation', () => {
  const validSample = {
      "id": "TEST-IncomingCallHandlingSchedule-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "day_of_week": "Monday",
      "from_time": "9:00:00",
      "to_time": "17:00:00",
      "agent_group": "LINK-agent_group-001"
  };

  it('validates a correct Incoming Call Handling Schedule object', () => {
    const result = IncomingCallHandlingScheduleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = IncomingCallHandlingScheduleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "day_of_week" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).day_of_week;
    const result = IncomingCallHandlingScheduleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = IncomingCallHandlingScheduleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
