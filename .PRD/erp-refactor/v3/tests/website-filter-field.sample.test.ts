import { describe, it, expect } from 'vitest';
import { WebsiteFilterFieldSchema, WebsiteFilterFieldInsertSchema } from '../types/website-filter-field.js';

describe('WebsiteFilterField Zod validation', () => {
  const validSample = {
      "id": "TEST-WebsiteFilterField-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "fieldname": "Sample Fieldname"
  };

  it('validates a correct Website Filter Field object', () => {
    const result = WebsiteFilterFieldSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = WebsiteFilterFieldInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = WebsiteFilterFieldSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
