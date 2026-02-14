import { describe, it, expect } from 'vitest';
import { RenameToolSchema, RenameToolInsertSchema } from '../types/rename-tool.js';

describe('RenameTool Zod validation', () => {
  const validSample = {
      "id": "TEST-RenameTool-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "select_doctype": "LINK-select_doctype-001",
      "file_to_rename": "/files/sample.png",
      "rename_log": "Sample text for rename_log"
  };

  it('validates a correct Rename Tool object', () => {
    const result = RenameToolSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = RenameToolInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = RenameToolSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
