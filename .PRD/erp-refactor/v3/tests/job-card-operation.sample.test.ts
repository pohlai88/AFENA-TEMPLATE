import { describe, it, expect } from 'vitest';
import { JobCardOperationSchema, JobCardOperationInsertSchema } from '../types/job-card-operation.js';

describe('JobCardOperation Zod validation', () => {
  const validSample = {
      "id": "TEST-JobCardOperation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "sub_operation": "LINK-sub_operation-001",
      "completed_qty": 1,
      "completed_time": "Sample Completed Time",
      "status": "Pending"
  };

  it('validates a correct Job Card Operation object', () => {
    const result = JobCardOperationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = JobCardOperationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = JobCardOperationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
