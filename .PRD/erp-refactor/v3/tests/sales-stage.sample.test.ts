import { describe, it, expect } from 'vitest';
import { SalesStageSchema, SalesStageInsertSchema } from '../types/sales-stage.js';

describe('SalesStage Zod validation', () => {
  const validSample = {
      "id": "TEST-SalesStage-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "stage_name": "Sample Stage Name"
  };

  it('validates a correct Sales Stage object', () => {
    const result = SalesStageSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SalesStageInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SalesStageSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
