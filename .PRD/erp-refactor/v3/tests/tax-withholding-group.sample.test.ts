import { describe, it, expect } from 'vitest';
import { TaxWithholdingGroupSchema, TaxWithholdingGroupInsertSchema } from '../types/tax-withholding-group.js';

describe('TaxWithholdingGroup Zod validation', () => {
  const validSample = {
      "id": "TEST-TaxWithholdingGroup-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "group_name": "Sample Group Name"
  };

  it('validates a correct Tax Withholding Group object', () => {
    const result = TaxWithholdingGroupSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TaxWithholdingGroupInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "group_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).group_name;
    const result = TaxWithholdingGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TaxWithholdingGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
