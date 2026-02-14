import { describe, it, expect } from 'vitest';
import { AccountingDimensionDetailSchema, AccountingDimensionDetailInsertSchema } from '../types/accounting-dimension-detail.js';

describe('AccountingDimensionDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-AccountingDimensionDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "reference_document": "LINK-reference_document-001",
      "default_dimension": "LINK-default_dimension-001",
      "mandatory_for_bs": "0",
      "mandatory_for_pl": "0",
      "automatically_post_balancing_accounting_entry": "0",
      "offsetting_account": "LINK-offsetting_account-001"
  };

  it('validates a correct Accounting Dimension Detail object', () => {
    const result = AccountingDimensionDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AccountingDimensionDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AccountingDimensionDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
