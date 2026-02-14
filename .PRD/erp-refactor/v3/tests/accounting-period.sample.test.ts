import { describe, it, expect } from 'vitest';
import { AccountingPeriodSchema, AccountingPeriodInsertSchema } from '../types/accounting-period.js';

describe('AccountingPeriod Zod validation', () => {
  const validSample = {
      "id": "TEST-AccountingPeriod-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "period_name": "Sample Period Name",
      "start_date": "2024-01-15",
      "end_date": "2024-01-15",
      "company": "LINK-company-001",
      "disabled": "0",
      "exempted_role": "LINK-exempted_role-001"
  };

  it('validates a correct Accounting Period object', () => {
    const result = AccountingPeriodSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AccountingPeriodInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "period_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).period_name;
    const result = AccountingPeriodSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AccountingPeriodSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
