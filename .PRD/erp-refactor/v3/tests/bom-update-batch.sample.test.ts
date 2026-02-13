import { describe, it, expect } from 'vitest';
import { BomUpdateBatchSchema, BomUpdateBatchInsertSchema } from '../types/bom-update-batch.js';

describe('BomUpdateBatch Zod validation', () => {
  const validSample = {
      "id": "TEST-BomUpdateBatch-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "level": 1,
      "batch_no": 1,
      "boms_updated": "Sample text for boms_updated",
      "status": "Pending"
  };

  it('validates a correct BOM Update Batch object', () => {
    const result = BomUpdateBatchSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BomUpdateBatchInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BomUpdateBatchSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
