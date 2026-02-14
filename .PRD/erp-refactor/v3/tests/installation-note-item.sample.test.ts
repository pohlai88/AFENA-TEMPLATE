import { describe, it, expect } from 'vitest';
import { InstallationNoteItemSchema, InstallationNoteItemInsertSchema } from '../types/installation-note-item.js';

describe('InstallationNoteItem Zod validation', () => {
  const validSample = {
      "id": "TEST-InstallationNoteItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "serial_and_batch_bundle": "LINK-serial_and_batch_bundle-001",
      "serial_no": "Sample text for serial_no",
      "qty": 1,
      "description": "Sample text for description",
      "prevdoc_detail_docname": "Sample Against Document Detail No",
      "prevdoc_docname": "Sample Against Document No",
      "prevdoc_doctype": "Sample Document Type"
  };

  it('validates a correct Installation Note Item object', () => {
    const result = InstallationNoteItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = InstallationNoteItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = InstallationNoteItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = InstallationNoteItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
