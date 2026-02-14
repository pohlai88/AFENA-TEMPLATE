import { describe, it, expect } from 'vitest';
import { ContractFulfilmentChecklistSchema, ContractFulfilmentChecklistInsertSchema } from '../types/contract-fulfilment-checklist.js';

describe('ContractFulfilmentChecklist Zod validation', () => {
  const validSample = {
      "id": "TEST-ContractFulfilmentChecklist-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "fulfilled": "0",
      "requirement": "Sample Requirement",
      "notes": "Sample text for notes",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Contract Fulfilment Checklist object', () => {
    const result = ContractFulfilmentChecklistSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ContractFulfilmentChecklistInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ContractFulfilmentChecklistSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
