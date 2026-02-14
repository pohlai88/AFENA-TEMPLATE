import { describe, it, expect } from 'vitest';
import { AccountingDimensionSchema, AccountingDimensionInsertSchema } from '../types/accounting-dimension.js';

describe('AccountingDimension Zod validation', () => {
  const validSample = {
      "id": "TEST-AccountingDimension-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "document_type": "LINK-document_type-001",
      "label": "Sample Dimension Name",
      "fieldname": "Sample Fieldname",
      "disabled": "0"
  };

  it('validates a correct Accounting Dimension object', () => {
    const result = AccountingDimensionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AccountingDimensionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "document_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).document_type;
    const result = AccountingDimensionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AccountingDimensionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
