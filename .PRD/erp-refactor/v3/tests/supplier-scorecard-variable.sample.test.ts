import { describe, it, expect } from 'vitest';
import { SupplierScorecardVariableSchema, SupplierScorecardVariableInsertSchema } from '../types/supplier-scorecard-variable.js';

describe('SupplierScorecardVariable Zod validation', () => {
  const validSample = {
      "id": "TEST-SupplierScorecardVariable-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "variable_label": "Sample Variable Name",
      "is_custom": "0",
      "param_name": "Sample Parameter Name",
      "path": "Sample Path",
      "description": "Sample text for description"
  };

  it('validates a correct Supplier Scorecard Variable object', () => {
    const result = SupplierScorecardVariableSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupplierScorecardVariableInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "variable_label" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).variable_label;
    const result = SupplierScorecardVariableSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupplierScorecardVariableSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
