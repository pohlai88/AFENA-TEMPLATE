import { describe, it, expect } from 'vitest';
import { WorkstationOperatingComponentAccountSchema, WorkstationOperatingComponentAccountInsertSchema } from '../types/workstation-operating-component-account.js';

describe('WorkstationOperatingComponentAccount Zod validation', () => {
  const validSample = {
      "id": "TEST-WorkstationOperatingComponentAccount-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "expense_account": "LINK-expense_account-001"
  };

  it('validates a correct Workstation Operating Component Account object', () => {
    const result = WorkstationOperatingComponentAccountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = WorkstationOperatingComponentAccountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = WorkstationOperatingComponentAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = WorkstationOperatingComponentAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
