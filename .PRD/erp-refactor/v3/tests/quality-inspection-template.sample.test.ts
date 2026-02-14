import { describe, it, expect } from 'vitest';
import { QualityInspectionTemplateSchema, QualityInspectionTemplateInsertSchema } from '../types/quality-inspection-template.js';

describe('QualityInspectionTemplate Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityInspectionTemplate-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "quality_inspection_template_name": "Sample Quality Inspection Template Name"
  };

  it('validates a correct Quality Inspection Template object', () => {
    const result = QualityInspectionTemplateSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityInspectionTemplateInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "quality_inspection_template_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).quality_inspection_template_name;
    const result = QualityInspectionTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityInspectionTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
