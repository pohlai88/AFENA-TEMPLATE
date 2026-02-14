import { describe, it, expect } from 'vitest';
import { ShareholderSchema, ShareholderInsertSchema } from '../types/shareholder.js';

describe('Shareholder Zod validation', () => {
  const validSample = {
      "id": "TEST-Shareholder-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "title": "Sample Title",
      "naming_series": "Option1",
      "folio_no": "Sample Folio no.",
      "company": "LINK-company-001",
      "is_company": "0",
      "address_html": "Sample text for address_html",
      "contact_html": "Sample text for contact_html",
      "contact_list": "console.log(\"hello\");"
  };

  it('validates a correct Shareholder object', () => {
    const result = ShareholderSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ShareholderInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "title" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).title;
    const result = ShareholderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ShareholderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
