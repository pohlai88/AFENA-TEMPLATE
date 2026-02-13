import { describe, it, expect } from 'vitest';
import { ServiceDaySchema, ServiceDayInsertSchema } from '../types/service-day.js';

describe('ServiceDay Zod validation', () => {
  const validSample = {
      "id": "TEST-ServiceDay-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "workday": "Monday",
      "start_time": "10:30:00",
      "end_time": "10:30:00"
  };

  it('validates a correct Service Day object', () => {
    const result = ServiceDaySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ServiceDayInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "workday" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).workday;
    const result = ServiceDaySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ServiceDaySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
