import { describe, it, expect } from 'vitest';
import { ItemQualityInspectionParameterSchema, ItemQualityInspectionParameterInsertSchema } from '../types/item-quality-inspection-parameter.js';

describe('ItemQualityInspectionParameter Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemQualityInspectionParameter-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "specification": "LINK-specification-001",
      "parameter_group": "LINK-parameter_group-001",
      "value": "Sample Acceptance Criteria Value",
      "numeric": "1",
      "min_value": 1,
      "max_value": 1,
      "formula_based_criteria": "0",
      "acceptance_formula": "console.log(\"hello\");"
  };

  it('validates a correct Item Quality Inspection Parameter object', () => {
    const result = ItemQualityInspectionParameterSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemQualityInspectionParameterInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "specification" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).specification;
    const result = ItemQualityInspectionParameterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemQualityInspectionParameterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
