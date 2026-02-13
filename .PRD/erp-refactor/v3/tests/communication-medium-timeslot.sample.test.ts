import { describe, it, expect } from 'vitest';
import { CommunicationMediumTimeslotSchema, CommunicationMediumTimeslotInsertSchema } from '../types/communication-medium-timeslot.js';

describe('CommunicationMediumTimeslot Zod validation', () => {
  const validSample = {
      "id": "TEST-CommunicationMediumTimeslot-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "day_of_week": "Monday",
      "from_time": "10:30:00",
      "to_time": "10:30:00",
      "employee_group": "LINK-employee_group-001"
  };

  it('validates a correct Communication Medium Timeslot object', () => {
    const result = CommunicationMediumTimeslotSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CommunicationMediumTimeslotInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "day_of_week" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).day_of_week;
    const result = CommunicationMediumTimeslotSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CommunicationMediumTimeslotSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
