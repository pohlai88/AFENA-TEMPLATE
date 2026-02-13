import { describe, it, expect } from 'vitest';
import { SupplierScorecardScoringVariableSchema, SupplierScorecardScoringVariableInsertSchema } from '../types/supplier-scorecard-scoring-variable.js';

describe('SupplierScorecardScoringVariable Zod validation', () => {
  const validSample = {
      "id": "TEST-SupplierScorecardScoringVariable-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "variable_label": "LINK-variable_label-001",
      "description": "Sample text for description",
      "value": 1,
      "param_name": "Sample Parameter Name",
      "path": "Sample Path"
  };

  it('validates a correct Supplier Scorecard Scoring Variable object', () => {
    const result = SupplierScorecardScoringVariableSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SupplierScorecardScoringVariableInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "variable_label" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).variable_label;
    const result = SupplierScorecardScoringVariableSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SupplierScorecardScoringVariableSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
