import { describe, it, expect } from 'vitest';
import { QualityInspectionParameterGroupSchema, QualityInspectionParameterGroupInsertSchema } from '../types/quality-inspection-parameter-group.js';

describe('QualityInspectionParameterGroup Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityInspectionParameterGroup-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "group_name": "Sample Parameter Group Name"
  };

  it('validates a correct Quality Inspection Parameter Group object', () => {
    const result = QualityInspectionParameterGroupSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityInspectionParameterGroupInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "group_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).group_name;
    const result = QualityInspectionParameterGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityInspectionParameterGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
