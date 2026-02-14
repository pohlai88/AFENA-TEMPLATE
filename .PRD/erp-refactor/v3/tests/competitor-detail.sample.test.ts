import { describe, it, expect } from 'vitest';
import { CompetitorDetailSchema, CompetitorDetailInsertSchema } from '../types/competitor-detail.js';

describe('CompetitorDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-CompetitorDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "competitor": "LINK-competitor-001"
  };

  it('validates a correct Competitor Detail object', () => {
    const result = CompetitorDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CompetitorDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "competitor" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).competitor;
    const result = CompetitorDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CompetitorDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
