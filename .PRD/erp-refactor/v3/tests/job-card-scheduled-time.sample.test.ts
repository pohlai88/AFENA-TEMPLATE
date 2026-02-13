import { describe, it, expect } from 'vitest';
import { JobCardScheduledTimeSchema, JobCardScheduledTimeInsertSchema } from '../types/job-card-scheduled-time.js';

describe('JobCardScheduledTime Zod validation', () => {
  const validSample = {
      "id": "TEST-JobCardScheduledTime-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "from_time": "2024-01-15T10:30:00.000Z",
      "to_time": "2024-01-15T10:30:00.000Z",
      "time_in_mins": 1
  };

  it('validates a correct Job Card Scheduled Time object', () => {
    const result = JobCardScheduledTimeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = JobCardScheduledTimeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = JobCardScheduledTimeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
