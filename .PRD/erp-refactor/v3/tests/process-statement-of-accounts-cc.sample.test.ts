import { describe, it, expect } from 'vitest';
import { ProcessStatementOfAccountsCcSchema, ProcessStatementOfAccountsCcInsertSchema } from '../types/process-statement-of-accounts-cc.js';

describe('ProcessStatementOfAccountsCc Zod validation', () => {
  const validSample = {
      "id": "TEST-ProcessStatementOfAccountsCc-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "cc": "LINK-cc-001"
  };

  it('validates a correct Process Statement Of Accounts CC object', () => {
    const result = ProcessStatementOfAccountsCcSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProcessStatementOfAccountsCcInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProcessStatementOfAccountsCcSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
