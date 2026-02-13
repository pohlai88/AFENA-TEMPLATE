import { describe, it, expect } from 'vitest';
import { JournalEntryTemplateSchema, JournalEntryTemplateInsertSchema } from '../types/journal-entry-template.js';

describe('JournalEntryTemplate Zod validation', () => {
  const validSample = {
      "id": "TEST-JournalEntryTemplate-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "template_title": "Sample Template Title",
      "voucher_type": "Journal Entry",
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "is_opening": "No",
      "multi_currency": "0"
  };

  it('validates a correct Journal Entry Template object', () => {
    const result = JournalEntryTemplateSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = JournalEntryTemplateInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "template_title" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).template_title;
    const result = JournalEntryTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = JournalEntryTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
