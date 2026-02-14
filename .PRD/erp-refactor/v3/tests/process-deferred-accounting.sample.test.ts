import { describe, it, expect } from 'vitest';
import { ProcessDeferredAccountingSchema, ProcessDeferredAccountingInsertSchema } from '../types/process-deferred-accounting.js';

describe('ProcessDeferredAccounting Zod validation', () => {
  const validSample = {
      "id": "TEST-ProcessDeferredAccounting-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "company": "LINK-company-001",
      "type": "Income",
      "account": "LINK-account-001",
      "posting_date": "Today",
      "start_date": "2024-01-15",
      "end_date": "2024-01-15",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Process Deferred Accounting object', () => {
    const result = ProcessDeferredAccountingSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProcessDeferredAccountingInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = ProcessDeferredAccountingSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProcessDeferredAccountingSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
