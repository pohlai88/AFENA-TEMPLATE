import { describe, it, expect } from 'vitest';
import { ContractTemplateSchema, ContractTemplateInsertSchema } from '../types/contract-template.js';

describe('ContractTemplate Zod validation', () => {
  const validSample = {
      "id": "TEST-ContractTemplate-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "title": "Sample Title",
      "contract_terms": "Sample text for contract_terms",
      "requires_fulfilment": "0",
      "contract_template_help": "Sample text for contract_template_help"
  };

  it('validates a correct Contract Template object', () => {
    const result = ContractTemplateSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ContractTemplateInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ContractTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
