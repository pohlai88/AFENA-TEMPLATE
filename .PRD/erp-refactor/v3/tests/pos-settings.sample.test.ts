import { describe, it, expect } from 'vitest';
import { PosSettingsSchema, PosSettingsInsertSchema } from '../types/pos-settings.js';

describe('PosSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-PosSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "invoice_type": "Sales Invoice",
      "post_change_gl_entries": "0"
  };

  it('validates a correct POS Settings object', () => {
    const result = PosSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
