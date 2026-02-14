import { describe, it, expect } from 'vitest';
import { TermsAndConditionsSchema, TermsAndConditionsInsertSchema } from '../types/terms-and-conditions.js';

describe('TermsAndConditions Zod validation', () => {
  const validSample = {
      "id": "TEST-TermsAndConditions-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "title": "Sample Title",
      "disabled": "0",
      "selling": "1",
      "buying": "1",
      "terms": "Sample text for terms",
      "terms_and_conditions_help": "Sample text for terms_and_conditions_help"
  };

  it('validates a correct Terms and Conditions object', () => {
    const result = TermsAndConditionsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TermsAndConditionsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "title" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).title;
    const result = TermsAndConditionsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TermsAndConditionsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
