import { describe, it, expect } from 'vitest';
import { AvailabilityOfSlotsSchema, AvailabilityOfSlotsInsertSchema } from '../types/availability-of-slots.js';

describe('AvailabilityOfSlots Zod validation', () => {
  const validSample = {
      "id": "TEST-AvailabilityOfSlots-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "day_of_week": "Sunday",
      "from_time": "10:30:00",
      "to_time": "10:30:00"
  };

  it('validates a correct Availability Of Slots object', () => {
    const result = AvailabilityOfSlotsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AvailabilityOfSlotsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "day_of_week" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).day_of_week;
    const result = AvailabilityOfSlotsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AvailabilityOfSlotsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
