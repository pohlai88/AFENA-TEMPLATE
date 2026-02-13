import { describe, it, expect } from 'vitest';
import { OperationSchema, OperationInsertSchema } from '../types/operation.js';

describe('Operation Zod validation', () => {
  const validSample = {
      "id": "TEST-Operation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "workstation": "LINK-workstation-001",
      "is_corrective_operation": "0",
      "create_job_card_based_on_batch_size": "0",
      "quality_inspection_template": "LINK-quality_inspection_template-001",
      "batch_size": "1",
      "total_operation_time": 1,
      "description": "Sample text for description"
  };

  it('validates a correct Operation object', () => {
    const result = OperationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = OperationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = OperationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
