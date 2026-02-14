import { describe, it, expect } from 'vitest';
import { AccountingDimensionFilterSchema, AccountingDimensionFilterInsertSchema } from '../types/accounting-dimension-filter.js';

describe('AccountingDimensionFilter Zod validation', () => {
  const validSample = {
      "id": "TEST-AccountingDimensionFilter-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "accounting_dimension": "Option1",
      "fieldname": "Sample Fieldname",
      "disabled": "0",
      "company": "LINK-company-001",
      "apply_restriction_on_values": "1",
      "allow_or_restrict": "Allow",
      "dimension_filter_help": "Sample text for dimension_filter_help"
  };

  it('validates a correct Accounting Dimension Filter object', () => {
    const result = AccountingDimensionFilterSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AccountingDimensionFilterInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "accounting_dimension" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).accounting_dimension;
    const result = AccountingDimensionFilterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AccountingDimensionFilterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
