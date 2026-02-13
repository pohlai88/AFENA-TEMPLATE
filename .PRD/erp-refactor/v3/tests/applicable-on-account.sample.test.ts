import { describe, it, expect } from 'vitest';
import { ApplicableOnAccountSchema, ApplicableOnAccountInsertSchema } from '../types/applicable-on-account.js';

describe('ApplicableOnAccount Zod validation', () => {
  const validSample = {
      "id": "TEST-ApplicableOnAccount-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "applicable_on_account": "LINK-applicable_on_account-001",
      "is_mandatory": "0"
  };

  it('validates a correct Applicable On Account object', () => {
    const result = ApplicableOnAccountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ApplicableOnAccountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "applicable_on_account" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).applicable_on_account;
    const result = ApplicableOnAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ApplicableOnAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
