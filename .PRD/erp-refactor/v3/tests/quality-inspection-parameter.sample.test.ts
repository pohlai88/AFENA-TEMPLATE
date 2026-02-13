import { describe, it, expect } from 'vitest';
import { QualityInspectionParameterSchema, QualityInspectionParameterInsertSchema } from '../types/quality-inspection-parameter.js';

describe('QualityInspectionParameter Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityInspectionParameter-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "parameter": "Sample Parameter",
      "parameter_group": "LINK-parameter_group-001",
      "description": "Sample text for description"
  };

  it('validates a correct Quality Inspection Parameter object', () => {
    const result = QualityInspectionParameterSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityInspectionParameterInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "parameter" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).parameter;
    const result = QualityInspectionParameterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityInspectionParameterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
