import { describe, it, expect } from 'vitest';
import { JobCardTimeLogSchema, JobCardTimeLogInsertSchema } from '../types/job-card-time-log.js';

describe('JobCardTimeLog Zod validation', () => {
  const validSample = {
      "id": "TEST-JobCardTimeLog-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "employee": "LINK-employee-001",
      "from_time": "2024-01-15T10:30:00.000Z",
      "to_time": "2024-01-15T10:30:00.000Z",
      "time_in_mins": 1,
      "completed_qty": "0",
      "operation": "LINK-operation-001"
  };

  it('validates a correct Job Card Time Log object', () => {
    const result = JobCardTimeLogSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = JobCardTimeLogInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = JobCardTimeLogSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
