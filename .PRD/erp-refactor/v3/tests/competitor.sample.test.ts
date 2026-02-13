import { describe, it, expect } from 'vitest';
import { CompetitorSchema, CompetitorInsertSchema } from '../types/competitor.js';

describe('Competitor Zod validation', () => {
  const validSample = {
      "id": "TEST-Competitor-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "competitor_name": "Sample Competitor Name",
      "website": "Sample Website"
  };

  it('validates a correct Competitor object', () => {
    const result = CompetitorSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CompetitorInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "competitor_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).competitor_name;
    const result = CompetitorSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CompetitorSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
