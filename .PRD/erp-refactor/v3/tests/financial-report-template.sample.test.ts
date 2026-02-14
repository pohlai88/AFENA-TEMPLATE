import { describe, it, expect } from 'vitest';
import { FinancialReportTemplateSchema, FinancialReportTemplateInsertSchema } from '../types/financial-report-template.js';

describe('FinancialReportTemplate Zod validation', () => {
  const validSample = {
      "id": "TEST-FinancialReportTemplate-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "template_name": "Sample Template Name",
      "report_type": "Profit and Loss Statement",
      "module": "LINK-module-001",
      "disabled": "0"
  };

  it('validates a correct Financial Report Template object', () => {
    const result = FinancialReportTemplateSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = FinancialReportTemplateInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "template_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).template_name;
    const result = FinancialReportTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = FinancialReportTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
