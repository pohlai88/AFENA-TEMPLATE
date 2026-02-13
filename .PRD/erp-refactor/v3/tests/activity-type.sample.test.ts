import { describe, it, expect } from 'vitest';
import { ActivityTypeSchema, ActivityTypeInsertSchema } from '../types/activity-type.js';

describe('ActivityType Zod validation', () => {
  const validSample = {
      "id": "TEST-ActivityType-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "activity_type": "Sample Activity Type",
      "costing_rate": 100,
      "billing_rate": 100,
      "disabled": "0"
  };

  it('validates a correct Activity Type object', () => {
    const result = ActivityTypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ActivityTypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "activity_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).activity_type;
    const result = ActivityTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ActivityTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
