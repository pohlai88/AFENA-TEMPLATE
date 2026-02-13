import { describe, it, expect } from 'vitest';
import { CodeListSchema, CodeListInsertSchema } from '../types/code-list.js';

describe('CodeList Zod validation', () => {
  const validSample = {
      "id": "TEST-CodeList-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "title": "Sample Title",
      "canonical_uri": "Sample Canonical URI",
      "url": "Sample URL",
      "default_common_code": "LINK-default_common_code-001",
      "version": "Sample Version",
      "publisher": "Sample Publisher",
      "publisher_id": "Sample Publisher ID",
      "description": "Sample text for description"
  };

  it('validates a correct Code List object', () => {
    const result = CodeListSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CodeListInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CodeListSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
