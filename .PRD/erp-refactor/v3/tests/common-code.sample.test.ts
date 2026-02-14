import { describe, it, expect } from 'vitest';
import { CommonCodeSchema, CommonCodeInsertSchema } from '../types/common-code.js';

describe('CommonCode Zod validation', () => {
  const validSample = {
      "id": "TEST-CommonCode-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "code_list": "LINK-code_list-001",
      "canonical_uri": "Sample Canonical URI",
      "title": "Sample Title",
      "common_code": "Sample Common Code",
      "description": "Sample text for description",
      "additional_data": "console.log(\"hello\");"
  };

  it('validates a correct Common Code object', () => {
    const result = CommonCodeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CommonCodeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "code_list" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).code_list;
    const result = CommonCodeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CommonCodeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
