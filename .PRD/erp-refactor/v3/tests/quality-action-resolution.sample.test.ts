import { describe, it, expect } from 'vitest';
import { QualityActionResolutionSchema, QualityActionResolutionInsertSchema } from '../types/quality-action-resolution.js';

describe('QualityActionResolution Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityActionResolution-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "problem": "Sample text for problem",
      "resolution": "Sample text for resolution",
      "status": "Open",
      "responsible": "LINK-responsible-001",
      "completion_by": "2024-01-15"
  };

  it('validates a correct Quality Action Resolution object', () => {
    const result = QualityActionResolutionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityActionResolutionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityActionResolutionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
