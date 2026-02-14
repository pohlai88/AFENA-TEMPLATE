import { describe, it, expect } from 'vitest';
import { CrmNoteSchema, CrmNoteInsertSchema } from '../types/crm-note.js';

describe('CrmNote Zod validation', () => {
  const validSample = {
      "id": "TEST-CrmNote-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "note": "Sample text for note",
      "added_by": "LINK-added_by-001",
      "added_on": "2024-01-15T10:30:00.000Z"
  };

  it('validates a correct CRM Note object', () => {
    const result = CrmNoteSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CrmNoteInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CrmNoteSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
