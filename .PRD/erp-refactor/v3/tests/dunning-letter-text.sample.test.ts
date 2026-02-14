import { describe, it, expect } from 'vitest';
import { DunningLetterTextSchema, DunningLetterTextInsertSchema } from '../types/dunning-letter-text.js';

describe('DunningLetterText Zod validation', () => {
  const validSample = {
      "id": "TEST-DunningLetterText-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "language": "LINK-language-001",
      "is_default_language": "0",
      "body_text": "Sample text for body_text",
      "closing_text": "Sample text for closing_text",
      "body_and_closing_text_help": "Sample text for body_and_closing_text_help"
  };

  it('validates a correct Dunning Letter Text object', () => {
    const result = DunningLetterTextSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DunningLetterTextInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DunningLetterTextSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
