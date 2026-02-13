import { describe, it, expect } from 'vitest';
import { QualityInspectionSchema, QualityInspectionInsertSchema } from '../types/quality-inspection.js';

describe('QualityInspection Zod validation', () => {
  const validSample = {
      "id": "TEST-QualityInspection-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "report_date": "Today",
      "status": "Accepted",
      "child_row_reference": "Sample Child Row Reference",
      "inspection_type": "Incoming",
      "reference_type": "Purchase Receipt",
      "reference_name": "LINK-reference_name-001",
      "item_code": "LINK-item_code-001",
      "item_serial_no": "LINK-item_serial_no-001",
      "batch_no": "LINK-batch_no-001",
      "sample_size": 1,
      "item_name": "Sample Item Name",
      "description": "Sample text for description",
      "bom_no": "LINK-bom_no-001",
      "quality_inspection_template": "LINK-quality_inspection_template-001",
      "manual_inspection": "0",
      "inspected_by": "user",
      "verified_by": "Sample Verified By",
      "remarks": "Sample text for remarks",
      "amended_from": "LINK-amended_from-001",
      "letter_head": "LINK-letter_head-001"
  };

  it('validates a correct Quality Inspection object', () => {
    const result = QualityInspectionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QualityInspectionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = QualityInspectionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QualityInspectionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
