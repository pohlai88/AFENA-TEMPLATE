import { describe, it, expect } from 'vitest';
import { QualityProcedureSchema, QualityProcedureInsertSchema } from '../types/quality-procedure.js';

describe('QualityProcedure Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityProcedure-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "quality_procedure_name": "Sample Quality Procedure",
      "process_owner": "LINK-process_owner-001",
      "process_owner_full_name": "Sample Process Owner Full Name",
      "parent_quality_procedure": "LINK-parent_quality_procedure-001",
      "is_group": "0",
      "rgt": 1,
      "lft": 1,
      "old_parent": "Sample old_parent"
  };

  it('validates a correct Quality Procedure object', () => {
    const result = QualityProcedureSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityProcedureInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "quality_procedure_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).quality_procedure_name;
    const result = QualityProcedureSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityProcedureSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
