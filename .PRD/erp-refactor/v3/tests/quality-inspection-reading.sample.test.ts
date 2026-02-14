import { describe, it, expect } from 'vitest';
import { QualityInspectionReadingSchema, QualityInspectionReadingInsertSchema } from '../types/quality-inspection-reading.js';

describe('QualityInspectionReading Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityInspectionReading-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "specification": "LINK-specification-001",
      "parameter_group": "LINK-parameter_group-001",
      "status": "Accepted",
      "value": "Sample Acceptance Criteria Value",
      "numeric": "1",
      "manual_inspection": "0",
      "min_value": 1,
      "max_value": 1,
      "formula_based_criteria": "0",
      "acceptance_formula": "console.log(\"hello\");",
      "reading_value": "Sample Reading Value",
      "reading_1": "Sample Reading 1",
      "reading_2": "Sample Reading 2",
      "reading_3": "Sample Reading 3",
      "reading_4": "Sample Reading 4",
      "reading_5": "Sample Reading 5",
      "reading_6": "Sample Reading 6",
      "reading_7": "Sample Reading 7",
      "reading_8": "Sample Reading 8",
      "reading_9": "Sample Reading 9",
      "reading_10": "Sample Reading 10"
  };

  it('validates a correct Quality Inspection Reading object', () => {
    const result = QualityInspectionReadingSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityInspectionReadingInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "specification" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).specification;
    const result = QualityInspectionReadingSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityInspectionReadingSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
