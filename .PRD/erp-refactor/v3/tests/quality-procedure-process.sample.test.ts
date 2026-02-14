import { describe, it, expect } from 'vitest';
import { QualityProcedureProcessSchema, QualityProcedureProcessInsertSchema } from '../types/quality-procedure-process.js';

describe('QualityProcedureProcess Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityProcedureProcess-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "process_description": "Sample text for process_description",
      "procedure": "LINK-procedure-001"
  };

  it('validates a correct Quality Procedure Process object', () => {
    const result = QualityProcedureProcessSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityProcedureProcessInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityProcedureProcessSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
